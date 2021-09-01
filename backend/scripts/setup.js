import {LCDClient, MnemonicKey} from '@terra-money/terra.js';
import fs from "fs";

// network {mainnet, tequila, bombay}
export function getClient(network = null){
    let client = new LCDClient({
        URL: 'https://lcd.terra.dev',
        chainID: 'columbus-4',
    });
    if (network === 'tequila') {
        client = new LCDClient({
            URL: 'https://tequila-lcd.terra.dev',
            chainID: 'tequila-0004',
        });
    } else if (network === 'bombay') {
        client = new LCDClient({
            URL: 'https://bombay-lcd.terra.dev',
            chainID: 'bombay-10',
        });
    }
    return client
}

export function getWallet(client = getClient()) {
    const path = './mnemonic.txt'
    const mnemonic = fs.readFileSync(path, 'utf8').trim()
    return client.wallet(new MnemonicKey({
        mnemonic: mnemonic,
    }))
}


