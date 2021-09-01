use cosmwasm_std::{BankMsg, Decimal, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Uint128};
use cw20_base::contract::{execute_burn, execute_mint};

use crate::ContractError;
use crate::state::{CLAIMS, INVESTMENT, TOTAL_SUPPLY};

// TODO: this will be dynamic
pub const EXCHANGE_RATIO: Decimal = Decimal::one();

pub fn bond(deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
    // ensure we have the proper denom
    let invest = INVESTMENT.load(deps.storage)?;
    // payment finds the proper coin (or throws an error)
    let payment = info
        .funds
        .iter()
        .find(|x| x.denom == invest.bond_denom)
        .ok_or_else(|| ContractError::EmptyBalance {
            denom: invest.bond_denom.clone(),
        })?;


    // calculate to_mint and update total supply
    let mut supply = TOTAL_SUPPLY.load(deps.storage)?;
    let to_mint = EXCHANGE_RATIO * payment.amount;
    supply.bonded += payment.amount;
    supply.issued += to_mint;
    TOTAL_SUPPLY.save(deps.storage, &supply)?;

    // call into cw20-base to mint the token, call as self as no one else is allowed
    let sub_info = MessageInfo {
        sender: env.contract.address.clone(),
        funds: vec![],
    };
    execute_mint(deps, env, sub_info, info.sender.to_string(), to_mint)?;

    let res = Response::new()
        // TODO: send to Anchor
        .add_attribute("action", "bond")
        .add_attribute("from", info.sender)
        .add_attribute("bonded", payment.amount)
        .add_attribute("minted", to_mint);
    Ok(res)
}

pub fn unbond(
    mut deps: DepsMut,
    env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> Result<Response, ContractError> {
    let invest = INVESTMENT.load(deps.storage)?;
    // ensure it is big enough to care
    if amount < invest.min_withdrawal {
        return Err(ContractError::UnbondTooSmall {
            min_bonded: invest.min_withdrawal,
            denom: invest.bond_denom,
        });
    }
    // calculate tax and remainer to unbond
    let tax = amount * invest.exit_tax;

    // burn from the original caller
    execute_burn(deps.branch(), env.clone(), info.clone(), amount)?;
    if tax > Uint128::zero() {
        let sub_info = MessageInfo {
            sender: env.contract.address.clone(),
            funds: vec![],
        };
        // call into cw20-base to mint tokens to owner, call as self as no one else is allowed
        execute_mint(
            deps.branch(),
            env.clone(),
            sub_info,
            invest.owner.to_string(),
            tax,
        )?;
    }


    let remainder = amount.checked_sub(tax).map_err(StdError::overflow)?;
    let mut supply = TOTAL_SUPPLY.load(deps.storage)?;

    supply.bonded = supply.bonded.checked_sub(remainder).map_err(StdError::overflow)?;
    supply.issued = supply.issued.checked_sub(remainder).map_err(StdError::overflow)?;
    supply.claims += remainder;
    TOTAL_SUPPLY.save(deps.storage, &supply)?;

    CLAIMS.create_claim(
        deps.storage,
        &info.sender,
        remainder,
        invest.unbonding_period.after(&env.block),
    )?;

    let res = Response::new()
        .add_attribute("action", "unbond")
        .add_attribute("to", info.sender)
        .add_attribute("unbonded", remainder)
        .add_attribute("burnt", remainder);
    Ok(res)
}


pub fn claim(deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
    // find how many tokens the contract has
    let invest = INVESTMENT.load(deps.storage)?;
    let mut balance = deps
        .querier
        .query_balance(&env.contract.address, &invest.bond_denom)?;
    if balance.amount < invest.min_withdrawal {
        return Err(ContractError::BalanceTooSmall {});
    }

    // check how much to send - min(balance, claims[sender]), and reduce the claim
    // Ensure we have enough balance to cover this and only send some claims if that is all we can cover
    let to_send =
        CLAIMS.claim_tokens(deps.storage, &info.sender, &env.block, Some(balance.amount))?;
    if to_send == Uint128::zero() {
        return Err(ContractError::NothingToClaim {});
    }

    // update total supply (lower claim)
    TOTAL_SUPPLY.update(deps.storage, |mut supply| -> StdResult<_> {
        supply.claims = supply.claims.checked_sub(to_send)?;
        Ok(supply)
    })?;


    // transfer tokens to the sender
    balance.amount = to_send;
    let res = Response::new()
        // TODO: get from Anchor
        .add_message(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![balance],
        })
        .add_attribute("action", "claim")
        .add_attribute("from", info.sender)
        .add_attribute("amount", to_send);
    Ok(res)
}
