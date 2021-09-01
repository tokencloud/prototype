use cosmwasm_std::{Deps, DepsMut, Env, MessageInfo, Order, ReplyOn, Response, StdResult, SubMsg, to_binary, WasmMsg};
use cw0::maybe_addr;
use cw20_base::msg::InstantiateMsg;
use cw_storage_plus::Bound;

use crate::ContractError;
use crate::msg::{CreatorTokenResponse, CreatorTokensResponse, InstantiateCreatorTokenMsg};
use crate::state::{CONFIG, creator_tokens, CreatorTokenInfo};

pub fn instantiate_creator_token(deps: DepsMut, _env: Env, info: MessageInfo, msg: InstantiateCreatorTokenMsg) -> Result<Response, ContractError> {
    let config = CONFIG.update(deps.storage, |mut config| -> StdResult<_> {
        config.creator_token_id += 1;
        Ok(config)
    })?;
    let token_id = config.creator_token_id;

    // TODO: validate if name and symbol is unique

    creator_tokens().save(deps.storage, &token_id.to_string(), &CreatorTokenInfo {
        owner: info.sender.clone(),
        contract_address: None,
        name: msg.name.clone(),
        symbol: msg.symbol.clone(),
        decimals: msg.decimals.clone(),
        marketing: msg.marketing.clone(),
    })?;

    Ok(Response::new()
        .add_attribute("action", "create_token")
        .add_attribute("owner", &info.sender)
        .add_submessage(SubMsg {
            id: token_id,
            gas_limit: None,
            msg: WasmMsg::Instantiate {
                code_id: config.cw20_code_id,
                funds: vec![],
                admin: Some(_env.contract.address.to_string()),
                label: "".to_string(),
                msg: to_binary(&InstantiateMsg {
                    name: msg.name,
                    symbol: msg.symbol,
                    decimals: msg.decimals,
                    initial_balances: vec![],
                    mint: None,
                    marketing: msg.marketing,
                })?,
            }.into(),
            reply_on: ReplyOn::Success,
        })
    )
}

const DEFAULT_LIMIT: u32 = 20;
const MAX_LIMIT: u32 = 50;

pub fn query_all_creator_tokens(
    deps: Deps,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<CreatorTokensResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start_addr = maybe_addr(deps.api, start_after)?;
    let start = start_addr.map(|addr| Bound::exclusive(addr.as_ref()));

    let registered_tokens: StdResult<Vec<CreatorTokenResponse>> = creator_tokens()
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| item.map(|(k, v)| CreatorTokenResponse {
            id: String::from_utf8_lossy(&k).to_string(),
            contract_address: v.contract_address,
            name: v.name,
            symbol: v.symbol,
            decimals: v.decimals,
            marketing: v.marketing,
        }))
        .collect();
    Ok(CreatorTokensResponse { tokens: registered_tokens? })
}
