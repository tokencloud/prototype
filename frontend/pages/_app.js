import React, { useState } from 'react';

import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import 'tailwindcss/tailwind.css';

import {
  StaticWalletProvider,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { TokensContext } from '../contexts/tokensContext';
import { initialTokens } from '../utils/data';

import '../styles/styles.css';

const main = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
  fcd: 'https://fcd.terra.dev',
  mainContractAddress: null,
};

const test = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
  fcd: 'https://tequila-fcd.terra.dev',
  mainContractAddress: null,
};

const bombay = {
  name: 'bombay',
  chainID: 'bombay-10',
  lcd: 'https://bombay-lcd.terra.dev',
  fcd: 'https://bombay-fcd.terra.dev',
};

const walletConnectChainIds = {
  0: main,
  1: test,
  2: bombay,
};

export default function MyApp({ Component, pageProps }) {
  const [tokens, setTokens] = useState([...initialTokens]);

  const main = (
    <TokensContext.Provider value={[tokens, setTokens]}>
      <Head>
        <title>TinyTerra</title>
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
      </Head>
      <div className='content-center bg-bg bg-cover min-h-screen'>
        <div className='min-h-screen bg-black/40'>
          <Navbar />
          <Component {...pageProps} />
        </div>
        <div className='bg-black/40'>
          <Footer />
        </div>
      </div>
    </TokensContext.Provider>
  );

  return typeof window !== 'undefined' ? (
    <WalletProvider
      defaultNetwork={bombay}
      walletConnectChainIds={walletConnectChainIds}>
      {main}
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={bombay}>{main}</StaticWalletProvider>
  );
}
