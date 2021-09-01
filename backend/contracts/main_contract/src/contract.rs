use cosmwasm_std::{Binary, coin, Decimal, Deps, DepsMut, Env, MessageInfo, Reply, Response, StdError, StdResult, to_binary, Uint128};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cw20::{Logo, LogoInfo, MarketingInfoResponse};
use cw20_base::allowances::{
    execute_burn_from, execute_decrease_allowance, execute_increase_allowance, execute_send_from,
    execute_transfer_from, query_allowance,
};
use cw20_base::contract::{
    execute_burn, execute_send, execute_transfer, query_balance, query_token_info,
};
use cw20_base::state::{LOGO, MARKETING_INFO, MinterData, TOKEN_INFO, TokenInfo};
use cw2::set_contract_version;
use protobuf::Message;

use crate::bond::{bond, claim, EXCHANGE_RATIO, unbond};
use crate::error::ContractError;
use crate::logo::verify_logo;
use crate::msg::{ExecuteMsg, InstantiateMsg, InvestmentResponse, QueryMsg};
use crate::response::MsgInstantiateContractResponse;
use crate::state::{CLAIMS, Config, CONFIG, creator_tokens, INVESTMENT, InvestmentInfo, Supply, TOTAL_SUPPLY};
use crate::token::{instantiate_creator_token, query_all_creator_tokens};

// version info for migration info
const CONTRACT_NAME: &str = "tokenbase_token";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // store token info using cw20-base format
    let data = TokenInfo {
        name: msg.name,
        symbol: msg.symbol,
        decimals: msg.decimals,
        total_supply: Uint128::zero(),
        // set self as minter, so contract can properly execute mint and burn
        mint: Some(MinterData {
            minter: env.contract.address,
            cap: Some(Uint128::new(1_000_000)),
        }),
    };
    TOKEN_INFO.save(deps.storage, &data)?;

    let config = Config {
        cw20_code_id: msg.cw20_code_id,
        creator_token_id: 99, // start token_ids from 99+1 = 100
    };
    CONFIG.save(deps.storage, &config)?;

    let invest = InvestmentInfo {
        owner: info.sender,
        exit_tax: msg.exit_tax,
        unbonding_period: msg.unbonding_period,
        bond_denom: msg.bond_denom,
        min_withdrawal: msg.min_withdrawal,
    };
    INVESTMENT.save(deps.storage, &invest)?;

    // set supply to 0
    let supply = Supply::default();
    TOTAL_SUPPLY.save(deps.storage, &supply)?;

    if let Some(marketing) = msg.marketing {
        let logo = if let Some(logo) = marketing.logo {
            verify_logo(&logo)?;
            LOGO.save(deps.storage, &logo)?;

            match logo {
                Logo::Url(url) => Some(LogoInfo::Url(url)),
                Logo::Embedded(_) => Some(LogoInfo::Embedded),
            }
        } else {
            None
        };

        let data = MarketingInfoResponse {
            project: marketing.project,
            description: marketing.description,
            marketing: marketing
                .marketing
                .map(|addr| deps.api.addr_validate(&addr))
                .transpose()?,
            logo,
        };
        MARKETING_INFO.save(deps.storage, &data)?;
    }

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Bond {} => bond(deps, env, info),
        ExecuteMsg::Unbond { amount } => unbond(deps, env, info, amount),
        ExecuteMsg::Claim {} => claim(deps, env, info),

        ExecuteMsg::InstantiateCreatorToken(msg) => instantiate_creator_token(deps, env, info, msg),

        // these all come from cw20-base to implement the cw20 standard
        ExecuteMsg::Transfer { recipient, amount } => {
            Ok(execute_transfer(deps, env, info, recipient, amount)?)
        }
        ExecuteMsg::Burn { amount } => Ok(execute_burn(deps, env, info, amount)?),
        ExecuteMsg::Send {
            contract,
            amount,
            msg,
        } => Ok(execute_send(deps, env, info, contract, amount, msg)?),
        ExecuteMsg::IncreaseAllowance {
            spender,
            amount,
            expires,
        } => Ok(execute_increase_allowance(
            deps, env, info, spender, amount, expires,
        )?),
        ExecuteMsg::DecreaseAllowance {
            spender,
            amount,
            expires,
        } => Ok(execute_decrease_allowance(
            deps, env, info, spender, amount, expires,
        )?),
        ExecuteMsg::TransferFrom {
            owner,
            recipient,
            amount,
        } => Ok(execute_transfer_from(
            deps, env, info, owner, recipient, amount,
        )?),
        ExecuteMsg::BurnFrom { owner, amount } => {
            Ok(execute_burn_from(deps, env, info, owner, amount)?)
        }
        ExecuteMsg::SendFrom {
            owner,
            contract,
            amount,
            msg,
        } => Ok(execute_send_from(
            deps, env, info, owner, contract, amount, msg,
        )?),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, _env: Env, msg: Reply) -> Result<Response, ContractError> {
    let res: MsgInstantiateContractResponse = Message::parse_from_bytes(msg.result.unwrap().data.unwrap().as_slice()).map_err(|_| {
        StdError::parse_err("MsgInstantiateContractResponse", "failed to parse data")
    })?;
    let token_id = msg.id.to_string();
    let contract_address = res.contract_address;

    let r = creator_tokens().update(deps.storage, token_id.clone().as_str(), |creator_token_info| match creator_token_info {
        None => Err(ContractError::TokenCannotBeFound {}),
        Some(mut t) => {
            t.contract_address = Some(contract_address.clone());
            Ok(t)
        }
    })?;

    Ok(Response::new()
        .add_attribute("status", "token_contract_address_updated")
        .add_attribute("updated_token_id", token_id)
        .add_attribute("updated_contract_address", r.contract_address.unwrap())
    )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        // custom queries
        QueryMsg::Claims { address } => {
            to_binary(&CLAIMS.query_claims(deps, &deps.api.addr_validate(&address)?)?)
        }
        QueryMsg::Investment {} => to_binary(&query_investment(deps)?),
        QueryMsg::AllCreatorTokens { start_after, limit } => {
            to_binary(&query_all_creator_tokens(deps, start_after, limit)?)
        }
        // inherited from cw20-base
        QueryMsg::TokenInfo {} => to_binary(&query_token_info(deps)?),
        QueryMsg::Balance { address } => to_binary(&query_balance(deps, address)?),
        QueryMsg::Allowance { owner, spender } => {
            to_binary(&query_allowance(deps, owner, spender)?)
        }
    }
}

pub fn query_investment(deps: Deps) -> StdResult<InvestmentResponse> {
    let invest = INVESTMENT.load(deps.storage)?;
    let supply = TOTAL_SUPPLY.load(deps.storage)?;

    let res = InvestmentResponse {
        owner: invest.owner.to_string(),
        exit_tax: invest.exit_tax,
        min_withdrawal: invest.min_withdrawal,
        token_supply: supply.issued,
        bonded_tokens: coin(supply.bonded.u128(), &invest.bond_denom),
        nominal_value: if supply.issued.is_zero() {
            EXCHANGE_RATIO
        } else {
            Decimal::from_ratio(supply.bonded, supply.issued)
        },
    };
    Ok(res)
}
