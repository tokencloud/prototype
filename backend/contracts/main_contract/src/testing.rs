#[cfg(test)]
mod unit_tests {
    use cosmwasm_std::{Addr, BankMsg, coin, coins, ContractResult, CosmosMsg, Decimal, Deps, Env, Reply, SubMsgExecutionResponse, Uint128};
    use cosmwasm_std::testing::{
        MOCK_CONTRACT_ADDR, mock_dependencies, mock_env, mock_info,
    };
    use cw0::{DAY, Duration, HOUR};
    use cw20_base::allowances::query_allowance;
    use cw20_base::contract::{query_balance, query_token_info};
    use cw_controllers::Claim;

    use crate::contract::{execute, instantiate, query_investment, reply};
    use crate::ContractError;
    use crate::msg::{ExecuteMsg, InstantiateCreatorTokenMsg, InstantiateMsg};
    use crate::state::CLAIMS;
    use crate::token::query_all_creator_tokens;

    fn default_instantiate(tax_percent: u64, min_withdrawal: u128) -> InstantiateMsg {
        InstantiateMsg {
            name: "Cool Token".to_string(),
            symbol: "CTK".to_string(),
            decimals: 9,
            bond_denom: "uust".to_string(),
            unbonding_period: DAY * 3,
            exit_tax: Decimal::percent(tax_percent),
            min_withdrawal: Uint128::new(min_withdrawal),
            marketing: None,
            cw20_code_id: 0,
        }
    }

    fn get_balance<U: Into<String>>(deps: Deps, addr: U) -> Uint128 {
        query_balance(deps, addr.into()).unwrap().balance
    }

    fn get_claims(deps: Deps, addr: &str) -> Vec<Claim> {
        CLAIMS
            .query_claims(deps, &Addr::unchecked(addr))
            .unwrap()
            .claims
    }

    // just a test helper, forgive the panic
    fn later(env: &Env, delta: Duration) -> Env {
        let time_delta = match delta {
            Duration::Time(t) => t,
            _ => panic!("Must provide duration in time"),
        };
        let mut res = env.clone();
        res.block.time = res.block.time.plus_seconds(time_delta);
        res
    }

    #[test]
    fn proper_instantiation() {
        let mut deps = mock_dependencies(&[]);

        let creator = String::from("creator");
        let msg = InstantiateMsg {
            name: "Cool Token".to_string(),
            symbol: "CTK".to_string(),
            decimals: 0,
            bond_denom: "uust".to_string(),
            unbonding_period: HOUR * 12,
            exit_tax: Decimal::percent(2),
            min_withdrawal: Uint128::new(50),
            marketing: None,
            cw20_code_id: 0,
        };
        let info = mock_info(&creator, &[]);

        // make sure we can instantiate with this
        let res = instantiate(deps.as_mut(), mock_env(), info, msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // token info is proper
        let token = query_token_info(deps.as_ref()).unwrap();
        assert_eq!(&token.name, &msg.name);
        assert_eq!(&token.symbol, &msg.symbol);
        assert_eq!(token.decimals, msg.decimals);
        assert_eq!(token.total_supply, Uint128::zero());

        // no balance
        assert_eq!(get_balance(deps.as_ref(), &creator), Uint128::zero());
        // no claims
        assert_eq!(get_claims(deps.as_ref(), &creator), vec![]);

        // investment info correct
        let invest = query_investment(deps.as_ref()).unwrap();
        assert_eq!(&invest.owner, &creator);
        assert_eq!(invest.exit_tax, msg.exit_tax);
        assert_eq!(invest.min_withdrawal, msg.min_withdrawal);

        assert_eq!(invest.token_supply, Uint128::zero());
        assert_eq!(invest.bonded_tokens, coin(0, "uust"));
        assert_eq!(invest.nominal_value, Decimal::one());
    }

    #[test]
    fn bonding_issues_tokens() {
        let mut deps = mock_dependencies(&[]);

        let creator = String::from("creator");
        let instantiate_msg = default_instantiate(2, 50);
        let info = mock_info(&creator, &[]);

        // make sure we can instantiate with this
        let res = instantiate(deps.as_mut(), mock_env(), info, instantiate_msg).unwrap();
        assert_eq!(0, res.messages.len());

        // let's bond some tokens now
        let bob = String::from("bob");
        let bond_msg = ExecuteMsg::Bond {};
        let info = mock_info(&bob, &[coin(10, "random"), coin(1000, "uust")]);

        // try to bond and make sure we trigger delegation
        execute(deps.as_mut(), mock_env(), info, bond_msg).unwrap();

        // bob got 1000 CTK for 1000 stake at a 1.0 ratio
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(1000));

        // investment info correct (updated supply)
        let invest = query_investment(deps.as_ref()).unwrap();
        assert_eq!(invest.token_supply, Uint128::new(1000));
        assert_eq!(invest.bonded_tokens, coin(1000, "uust"));
        assert_eq!(invest.nominal_value, Decimal::one());

        // token info also properly updated
        let token = query_token_info(deps.as_ref()).unwrap();
        assert_eq!(token.total_supply, Uint128::new(1000));
    }

    #[test]
    fn bonding_fails_with_wrong_denom() {
        let mut deps = mock_dependencies(&[]);

        let creator = String::from("creator");
        let instantiate_msg = default_instantiate(2, 50);
        let info = mock_info(&creator, &[]);

        // make sure we can instantiate with this
        let res = instantiate(deps.as_mut(), mock_env(), info, instantiate_msg).unwrap();
        assert_eq!(0, res.messages.len());

        // let's bond some tokens now
        let bob = String::from("bob");
        let bond_msg = ExecuteMsg::Bond {};
        let info = mock_info(&bob, &[coin(500, "photon")]);

        // try to bond and make sure we trigger delegation
        let err = execute(deps.as_mut(), mock_env(), info, bond_msg).unwrap_err();
        assert_eq!(
            err,
            ContractError::EmptyBalance {
                denom: "uust".to_string()
            }
        );
    }

    #[test]
    fn claims_paid_out_properly() {
        let mut deps = mock_dependencies(&[]);

        // create contract
        let creator = String::from("creator");
        let instantiate_msg = default_instantiate(10, 50);
        let info = mock_info(&creator, &[]);
        instantiate(deps.as_mut(), mock_env(), info, instantiate_msg).unwrap();

        // bond some tokens
        let bob = String::from("bob");
        let info = mock_info(&bob, &coins(1000, "uust"));
        execute(deps.as_mut(), mock_env(), info, ExecuteMsg::Bond {}).unwrap();

        // unbond part of them
        let unbond_msg = ExecuteMsg::Unbond {
            amount: Uint128::new(600),
        };
        let env = mock_env();
        let info = mock_info(&bob, &[]);
        execute(deps.as_mut(), env.clone(), info.clone(), unbond_msg).unwrap();

        // ensure claims are proper
        let bobs_claim = Uint128::new(540);
        let original_claims = vec![Claim {
            amount: bobs_claim,
            release_at: (DAY * 3).after(&env.block),
        }];
        assert_eq!(original_claims, get_claims(deps.as_ref(), &bob));

        // bob cannot exercise claims without enough balance
        let claim_ready = later(&env, (DAY * 3 + HOUR).unwrap());
        let too_soon = later(&env, DAY);
        let fail = execute(
            deps.as_mut(),
            claim_ready.clone(),
            info.clone(),
            ExecuteMsg::Claim {},
        );
        assert!(fail.is_err(), "{:?}", fail);

        // provide the balance, but claim not yet mature - also prohibited
        deps.querier
            .update_balance(MOCK_CONTRACT_ADDR, coins(540, "uust"));
        let fail = execute(deps.as_mut(), too_soon, info.clone(), ExecuteMsg::Claim {});
        assert!(fail.is_err(), "{:?}", fail);

        // this should work with cash and claims ready
        let res = execute(deps.as_mut(), claim_ready, info, ExecuteMsg::Claim {}).unwrap();
        assert_eq!(1, res.messages.len());
        let payout = &res.messages[0];
        match &payout.msg {
            CosmosMsg::Bank(BankMsg::Send { to_address, amount }) => {
                assert_eq!(amount, &coins(540, "uust"));
                assert_eq!(to_address, &bob);
            }
            _ => panic!("Unexpected message: {:?}", payout),
        }

        // claims have been removed
        assert_eq!(get_claims(deps.as_ref(), &bob), vec![]);
    }

    #[test]
    fn creator_token_can_be_instantiated() {
        let mut deps = mock_dependencies(&[]);
        // create contract
        let creator = String::from("creator");
        let instantiate_msg = default_instantiate(10, 50);
        let info = mock_info(&creator, &[]);
        instantiate(deps.as_mut(), mock_env(), info, instantiate_msg).unwrap();

        // create creator token
        let bob = String::from("bob");
        let instantiate_creator_token_msg = ExecuteMsg::InstantiateCreatorToken(InstantiateCreatorTokenMsg {
            name: "a".to_string(),
            symbol: "b".to_string(),
            decimals: 1,
            marketing: None,
        });
        let env = mock_env();
        let info = mock_info(&bob, &[]);

        let execution_response = execute(deps.as_mut(), env.clone(), info.clone(), instantiate_creator_token_msg).unwrap();

        let query_after_execution = query_all_creator_tokens(deps.as_ref(), None, None).unwrap();
        assert_eq!(query_after_execution.tokens[0].id, "100");
        assert_eq!(query_after_execution.tokens[0].name, "a");
        assert_eq!(query_after_execution.tokens[0].symbol, "b");

        let reply_response = reply(deps.as_mut(), mock_env(), Reply {
            id: execution_response.messages[0].id,
            result: ContractResult::Ok(SubMsgExecutionResponse {
                events: vec![],
                data: Some(
                    vec![
                        10, 8, 97, 100, 100, 114, 49, 50, 51, 52, // addr1234
                    ].into(),
                ),
            }),
        }).unwrap();

        assert_eq!(reply_response.attributes[0].value, "token_contract_address_updated");
        assert_eq!(reply_response.attributes[1].value, "100");
        assert_eq!(reply_response.attributes[2].value, "addr1234");

        let query_after = query_all_creator_tokens(deps.as_ref(), None, None).unwrap();
        assert_eq!(query_after.tokens[0].id, "100");
        assert_eq!(query_after.tokens[0].name, "a");
        assert_eq!(query_after.tokens[0].symbol, "b");
        assert_eq!(query_after.tokens[0].contract_address, Some("addr1234".to_string()));
    }

    #[test]
    fn cw20_imports_work() {
        let mut deps = mock_dependencies(&[]);

        // set the actors... bob stakes, sends coins to carl, and gives allowance to alice
        let bob = String::from("bob");
        let alice = String::from("alice");
        let carl = String::from("carl");

        // create the contract
        let creator = String::from("creator");
        let instantiate_msg = default_instantiate(2, 50);
        let info = mock_info(&creator, &[]);
        instantiate(deps.as_mut(), mock_env(), info, instantiate_msg).unwrap();

        // bond some tokens to create a balance
        let info = mock_info(&bob, &[coin(10, "random"), coin(1000, "uust")]);
        execute(deps.as_mut(), mock_env(), info, ExecuteMsg::Bond {}).unwrap();

        // bob got 1000 CTK for 1000 stake at a 1.0 ratio
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(1000));

        // send coins to carl
        let bob_info = mock_info(&bob, &[]);
        let transfer = ExecuteMsg::Transfer {
            recipient: carl.clone(),
            amount: Uint128::new(200),
        };
        execute(deps.as_mut(), mock_env(), bob_info.clone(), transfer).unwrap();
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(800));
        assert_eq!(get_balance(deps.as_ref(), &carl), Uint128::new(200));

        // allow alice
        let allow = ExecuteMsg::IncreaseAllowance {
            spender: alice.clone(),
            amount: Uint128::new(350),
            expires: None,
        };
        execute(deps.as_mut(), mock_env(), bob_info.clone(), allow).unwrap();
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(800));
        assert_eq!(get_balance(deps.as_ref(), &alice), Uint128::zero());
        assert_eq!(
            query_allowance(deps.as_ref(), bob.clone(), alice.clone())
                .unwrap()
                .allowance,
            Uint128::new(350)
        );

        // alice takes some for herself
        let self_pay = ExecuteMsg::TransferFrom {
            owner: bob.clone(),
            recipient: alice.clone(),
            amount: Uint128::new(250),
        };
        let alice_info = mock_info(&alice, &[]);
        execute(deps.as_mut(), mock_env(), alice_info, self_pay).unwrap();
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(550));
        assert_eq!(get_balance(deps.as_ref(), &alice), Uint128::new(250));
        assert_eq!(
            query_allowance(deps.as_ref(), bob.clone(), alice)
                .unwrap()
                .allowance,
            Uint128::new(100)
        );

        // burn some, but not too much
        let burn_too_much = ExecuteMsg::Burn {
            amount: Uint128::new(1000),
        };
        let failed = execute(deps.as_mut(), mock_env(), bob_info.clone(), burn_too_much);
        assert!(failed.is_err());
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(550));
        let burn = ExecuteMsg::Burn {
            amount: Uint128::new(130),
        };
        execute(deps.as_mut(), mock_env(), bob_info, burn).unwrap();
        assert_eq!(get_balance(deps.as_ref(), &bob), Uint128::new(420));
    }
}
