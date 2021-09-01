import React, { useMemo } from 'react';
import { useConnectedWallet } from "@terra-money/wallet-provider";
import { LCDClient } from "@terra-money/terra.js";

const MAIN_CONTRACT_ADDRESSES = {
  'bombay': 'terra1ac3f2ex0qcvcysuxac43hmyr08wetvxet64s3x'
}

export default function useLCDClient() {
  const connectedWallet = useConnectedWallet();

  return useMemo(() => {
    if (!connectedWallet) {
      return null;
    }
    const mainContractAddress = MAIN_CONTRACT_ADDRESSES[connectedWallet.network.name]
    if (!mainContractAddress) {
      alert(`Main contract is not deployed to ${connectedWallet.network.chainID}`)
      return null;
    }
    console.log(connectedWallet)
    const client = new LCDClient({
      URL: connectedWallet.network.lcd,
      chainID: connectedWallet.network.chainID,
    });
    client.mainContractAddress = mainContractAddress
    return client
  }, [connectedWallet])
}