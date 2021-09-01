use cosmwasm_std::{Binary, Coin, Decimal, Uint128};
use cw0::Duration;
use cw20::Expiration;
use cw20_base::msg::InstantiateMarketingInfo;
pub use cw_controllers::ClaimsResponse;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    /// name of the derivative token
    pub name: String,
    /// symbol / ticker of the derivative token
    pub symbol: String,
    /// decimal places of the derivative token (for UI)
    pub decimals: u8,

    /// This is bond denomination for example: uust
    pub bond_denom: String,
    /// This is the unbonding period
    pub unbonding_period: Duration,
    /// this is how much the owner takes as a cut when someone unbonds
    pub exit_tax: Decimal,
    /// This is the minimum amount we will pull out to reinvest, as well as a minimum
    /// that can be unbonded
    pub min_withdrawal: Uint128,

    pub marketing: Option<InstantiateMarketingInfo>,

    pub cw20_code_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    /// Bond will bond all tokens sent with the message and release derivative tokens
    Bond {},
    /// Unbond will "burn" the given amount of derivative tokens and send the unbonded
    /// tokens to the message sender (after exit tax is deducted)
    Unbond { amount: Uint128 },
    /// Claim is used to claim your native tokens that you previously "unbonded"
    /// after the chain-defined waiting period (eg. 3 weeks)
    Claim {},

    InstantiateCreatorToken(InstantiateCreatorTokenMsg),

    /// Implements CW20. Transfer is a base message to move tokens to another account without triggering actions
    Transfer { recipient: String, amount: Uint128 },
    /// Implements CW20. Burn is a base message to destroy tokens forever
    Burn { amount: Uint128 },
    /// Implements CW20.  Send is a base message to transfer tokens to a contract and trigger an action
    /// on the receiving contract.
    Send {
        contract: String,
        amount: Uint128,
        msg: Binary,
    },
    /// Implements CW20 "approval" extension. Allows spender to access an additional amount tokens
    /// from the owner's (env.sender) account. If expires is Some(), overwrites current allowance
    /// expiration with this one.
    IncreaseAllowance {
        spender: String,
        amount: Uint128,
        expires: Option<Expiration>,
    },
    /// Implements CW20 "approval" extension. Lowers the spender's access of tokens
    /// from the owner's (env.sender) account by amount. If expires is Some(), overwrites current
    /// allowance expiration with this one.
    DecreaseAllowance {
        spender: String,
        amount: Uint128,
        expires: Option<Expiration>,
    },
    /// Implements CW20 "approval" extension. Transfers amount tokens from owner -> recipient
    /// if `env.sender` has sufficient pre-approval.
    TransferFrom {
        owner: String,
        recipient: String,
        amount: Uint128,
    },
    /// Implements CW20 "approval" extension. Sends amount tokens from owner -> contract
    /// if `env.sender` has sufficient pre-approval.
    SendFrom {
        owner: String,
        contract: String,
        amount: Uint128,
        msg: Binary,
    },
    /// Implements CW20 "approval" extension. Destroys tokens forever
    BurnFrom { owner: String, amount: Uint128 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /// Claims shows the number of tokens this address can access when they are done unbonding
    Claims { address: String },
    /// Investment shows metadata on the bond info of the contract
    Investment {},
    /// Implements CW20. Returns the current balance of the given address, 0 if unset.
    Balance { address: String },
    /// Implements CW20. Returns metadata on the contract - name, decimals, supply, etc.
    TokenInfo {},
    /// Implements CW20 "allowance" extension.
    /// Returns how much spender can use from owner account, 0 if unset.
    Allowance { owner: String, spender: String },

    /// With Enumerable extension.
    /// Requires pagination. Lists all registered_token_ids controlled by the contract.
    /// Return type: TokensResponse.
    AllCreatorTokens {
        start_after: Option<String>,
        limit: Option<u32>,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InvestmentResponse {
    pub token_supply: Uint128,
    pub bonded_tokens: Coin,
    // ratio of bonded_tokens / token_supply (or how many native tokens that one derivative token is nominally worth)
    pub nominal_value: Decimal,

    /// owner created the contract and takes a cut
    pub owner: String,
    /// this is how much the owner takes as a cut when someone unbonds
    pub exit_tax: Decimal,
    /// This is the minimum amount we will pull out to reinvest, as well as a minimum
    /// that can be unbonded
    pub min_withdrawal: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateCreatorTokenMsg {
    /// name of the derivative token
    pub name: String,
    /// symbol / ticker of the derivative token
    pub symbol: String,
    /// decimal places of the derivative token (for UI)
    pub decimals: u8,
    pub marketing: Option<InstantiateMarketingInfo>,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug)]
pub struct CreatorTokenResponse {
    pub id: String,
    pub contract_address: Option<String>,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub marketing: Option<InstantiateMarketingInfo>,
}


#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug)]
pub struct CreatorTokensResponse {
    /// Contains all token_ids in lexicographical ordering
    /// If there are more than `limit`, use `start_from` in future queries
    /// to achieve pagination.
    pub tokens: Vec<CreatorTokenResponse>,
}
