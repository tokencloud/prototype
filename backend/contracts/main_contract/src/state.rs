use cosmwasm_std::{Addr, Decimal, Uint128};
use cw0::Duration;
use cw20_base::msg::InstantiateMarketingInfo;
use cw_controllers::Claims;
use cw_storage_plus::{Index, IndexedMap, IndexList, Item, MultiIndex};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug)]
#[serde(rename_all = "snake_case")]
pub struct Config {
    pub cw20_code_id: u64,
    pub creator_token_id: u64,
}

/// Investment info is fixed at instantiation, and is used to control the function of the contract
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InvestmentInfo {
    /// Owner created the contract and takes a cut
    pub owner: Addr,
    /// This is the denomination we can stake (and only one we accept for payments)
    pub bond_denom: String,
    /// This is the unbonding period of the native staking module
    /// We need this to only allow claims to be redeemed after the money has arrived
    pub unbonding_period: Duration,
    /// This is how much the owner takes as a cut when someone unbonds
    pub exit_tax: Decimal,
    /// This is the minimum amount that can be unbonded
    pub min_withdrawal: Uint128,
}

/// Supply is dynamic and tracks the current supply of staked and ERC20 tokens.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, Default)]
pub struct Supply {
    /// issued is how many derivative tokens this contract has issued
    pub issued: Uint128,
    /// bonded is how many native tokens exist bonded to the validator
    pub bonded: Uint128,
    /// claims is how many tokens need to be reserved paying back those who unbonded
    pub claims: Uint128,
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const INVESTMENT: Item<InvestmentInfo> = Item::new("invest");
pub const TOTAL_SUPPLY: Item<Supply> = Item::new("total_supply");
pub const CLAIMS: Claims = Claims::new("claims");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CreatorTokenInfo {
    pub owner: Addr,
    pub contract_address: Option<String>,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub marketing: Option<InstantiateMarketingInfo>,
}

pub struct CreatorTokenIndexes<'a> {
    pub owner: MultiIndex<'a, (Addr, Vec<u8>), CreatorTokenInfo>,
}

impl<'a> IndexList<CreatorTokenInfo> for CreatorTokenIndexes<'a> {
    fn get_indexes(&'_ self) -> Box<dyn Iterator<Item=&'_ dyn Index<CreatorTokenInfo>> + '_> {
        let v: Vec<&dyn Index<CreatorTokenInfo>> = vec![&self.owner];
        Box::new(v.into_iter())
    }
}

pub fn creator_tokens<'a>() -> IndexedMap<'a, &'a str, CreatorTokenInfo, CreatorTokenIndexes<'a>> {
    let indexes = CreatorTokenIndexes {
        owner: MultiIndex::new(
            |d: &CreatorTokenInfo, k: Vec<u8>| (d.owner.clone(), k),
            "creator_tokens",
            "creator_tokens__owner",
        ),
    };
    IndexedMap::new("creator_tokens", indexes)
}
