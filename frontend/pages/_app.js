import React, { useState } from 'react';

import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import 'tailwindcss/tailwind.css';

import { TokensContext } from '../contexts/tokensContext';
import { UserContext } from '../contexts/userContext';
import { initialTokens } from '../utils/data';
import '../styles/styles.css';

export default function MyApp({ Component, pageProps }) {
  const [tokens, setTokens] = useState(initialTokens);
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={[user, setUser]}>
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
    </UserContext.Provider>
  );
}
