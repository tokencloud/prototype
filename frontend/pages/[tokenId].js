import Head from 'next/head';

import React, { useContext, useEffect, useState } from 'react';
import { TokensContext } from '../contexts/tokensContext';
import { useRouter } from 'next/router';

import TokenHeader from '../components/token-header';
import TokenDetails from '../components/token-details';
import TokenChart from '../components/token-chart';

const Token = () => {
  const router = useRouter();
  const { tokenId } = router.query;
  const [tokens, setTokens] = useContext(TokensContext);

  const result = tokens.filter((i) => i.symbol === tokenId);
  const token = result[0];

  return (
    <>
      {token == null ? (
        <>Loading...</>
      ) : (
        <div>
          <Head>
            <title>{token.name} Token - TinyTerra</title>
          </Head>

          <div className='max-w-5xl mx-auto px-4 mt-6 lg:px-8'>
            <TokenHeader token={token} />
            <div className='grid grid-cols-5 gap-3'>
              <div className='col-span-5 lg:col-span-3'>
                <TokenChart token={token} />
              </div>

              <div className='lg:ml-4 col-span-5 lg:col-span-2'>
                <TokenDetails token={token} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Token;
