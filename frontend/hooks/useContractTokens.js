import React, { useEffect, useState } from 'react';
import useLCDClient from "./useLCDClient";

export default function useContractTokens() {
  const lcdClient = useLCDClient()
  const [contractTokens, setContractTokens] = useState([])

  useEffect(async () => {
    if (lcdClient) {
      const x = await lcdClient.wasm.contractQuery(lcdClient.mainContractAddress, { all_creator_tokens: {} })
      console.log(x.tokens)
      setContractTokens(x.tokens)
    }
  }, [lcdClient]);

  return contractTokens
}