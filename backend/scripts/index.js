import {getClient, getWallet} from "./setup.js";
import {MsgExecuteContract, MsgInstantiateContract} from "@terra-money/terra.js";

import {deployContracts} from "./deployContracts.js";

async function index() {
    const client = getClient('bombay')
    const wallet = getWallet(client)

    // if acc number is 0 just send some tokens to it
    const accountInfo = await client.auth.accountInfo(wallet.key.accAddress);

    console.log('accountInfo: ', accountInfo.toJSON(), ' address:', wallet.key.accAddress);
    const deployedContracts = await deployContracts()

    const contractAddress = await wallet.createAndSignTx({
        msgs: [new MsgInstantiateContract(
            wallet.key.accAddress,
            wallet.key.accAddress,
            deployedContracts["main_contract"],
            {
                name: "TokenCloudToken",
                symbol: "TCT",
                decimals: 9,
                exit_tax: "0.02",
                min_withdrawal: "1",
                bond_denom: "uust",
                unbonding_period: {time: 864000}, // in seconds
                cw20_code_id: deployedContracts["cw20_base"],
                marketing: null
            },
            []
        )]
    }).then(tx => client.tx.broadcast(tx)).then(result => {
        return result.logs[0].events[0].attributes[3].value
    })

    console.log(await client.wasm.contractInfo(contractAddress))

    await wallet.createAndSignTx({
        msgs: [new MsgExecuteContract(
            wallet.key.accAddress,
            contractAddress,
            {
                instantiate_creator_token: {
                    name: "CreatorTokenA",
                    symbol: "CTA",
                    decimals: 9,
                }
            }
        )]
    }).then(tx => {
        console.log(tx)
        client.tx.broadcast(tx)
    })

    await wallet.createAndSignTx({
        msgs: [new MsgExecuteContract(
            wallet.key.accAddress,
            contractAddress,
            {
                instantiate_creator_token: {
                    name: "CreatorTokenB",
                    symbol: "CTB",
                    decimals: 9,
                }
            }
        )]
    }).then(tx => {
        console.log(tx)
        client.tx.broadcast(tx)
    })

    const tokens = await client.wasm.contractQuery(contractAddress, {all_creator_tokens: {}})
    console.log(tokens)
}

await index()
