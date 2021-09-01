import fs from 'fs'
import {getClient, getWallet} from "./setup.js";
import {isTxError, MsgStoreCode} from "@terra-money/terra.js";

export async function deployContracts() {
    const client = getClient('bombay')
    const wallet = getWallet(client)

    async function deployContract(contractPath) {
        const storeCode = new MsgStoreCode(
            wallet.key.accAddress,
            fs.readFileSync(contractPath).toString('base64')
        );
        const storeCodeTx = await wallet.createAndSignTx({
            msgs: [storeCode],
        });
        const storeCodeTxResult = await client.tx.broadcast(storeCodeTx);
        if (isTxError(storeCodeTxResult)) {
            throw new Error(
                `store code failed. code: ${storeCodeTxResult.code}, codespace: ${storeCodeTxResult.codespace}, raw_log: ${storeCodeTxResult.raw_log}`
            );
        }
        const {
            store_code: {code_id},
        } = storeCodeTxResult.logs[0].eventsByType;
        return Number(code_id[0])
    }

    const deployedContracts = {}

    const paths = ['../artifacts/', '../artifacts_external/']

    for (const contractsPath of paths) {
        for await (const d of await fs.promises.opendir(contractsPath)) {
            if (d.name.endsWith('.wasm')) {
                const contractPath = contractsPath + d.name
                console.log(contractPath)
                deployedContracts[d.name.replace('.wasm', '')] = await deployContract(contractPath)
            }
        }
    }

    // const outPath = `./deployed_contracts_on_${client.config.chainID}.json`
    // console.log(deployedContracts)
    // console.log(`Saving contract codes to ${outPath}`)
    // fs.writeFile(outPath, JSON.stringify(deployedContracts), 'utf8', () => {
    //   console.log('Done')
    // })
    return deployedContracts
}


