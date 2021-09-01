import React, { useContext } from 'react';
import Link from 'next/link';

import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import ChangeArrow from './change-arrow';
import { randomArray } from '../utils/misc';
import { TokensContext } from '../contexts/tokensContext';

import { randomNumber, randomChangeType } from '../utils/misc';
import useContractTokens from "../hooks/useContractTokens";

export default function TokenLeaderboard() {
  const [tokens, setTokens] = useContext(TokensContext);
  const contractTokens = useContractTokens()

  return (
    <div className='flex flex-col max-w-4xl px-4 mx-auto'>
      <h3 className='text-2xl leading-6 mt-10 mb-4 drop-shadow-md font-medium text-white'>
        Token Leaderboard 🚀
      </h3>
      <div className='backdrop-filter backdrop-blur-md bg-gray-800/50 shadow overflow-hidden rounded-md'>
        <ul symbol='list' className='divide-y divide-gray-800/50'>
          {tokens
            .sort(
              ({ price: previousPrice }, { price: currentPrice }) =>
                currentPrice - previousPrice
            )
            .map((token, index) => (
              <li key={token.symbol}>
                <Link href={'/' + token.symbol}>
                  <a className='block hover:bg-gray-800/20 transition duration-500'>
                    <div className='flex items-center px-4 py-4 sm:px-6'>
                      <div className='min-w-0 flex-1 flex items-center'>
                        <div className='flex-shrink-0'>
                          <img
                            className='h-12 w-12 rounded-full'
                            src={token.imageUrl}
                            alt={token.name}
                          />
                          <span className='absolute -mt-5 -ml-2 text-3xl'>
                            {index == 0 && <>🥇</>}
                            {index == 1 && <>🥈</>}
                            {index == 2 && <>🥉</>}
                          </span>
                        </div>
                        <div className='min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4'>
                          <div className='my-auto'>
                            <p className='text-md font-bold text-white truncate'>
                              <span className='font-extralight mr-1'>
                                #{index + 1}
                              </span>
                              {token.name}
                            </p>
                            <p className='flex items-center text-md text-gray-400'>
                              <span className='truncate'>{token.symbol}</span>
                            </p>
                          </div>
                          <div className='hidden md:block'>
                            <Sparklines
                              data={randomArray()}
                              width={200}
                              height={40}
                              margin={5}>
                              <SparklinesLine
                                style={{
                                  strokeWidth: 4,
                                  stroke: '#6366F1',
                                  fill: 'none',
                                }}
                              />
                              <SparklinesSpots
                                size={2}
                                style={{
                                  stroke: 'white',
                                  strokeWidth: 3,
                                  fill: 'white',
                                }}
                              />
                            </Sparklines>
                          </div>
                        </div>
                        <div className='flex text-center'>
                          <div>
                            <p className='text-lg font-medium text-white'>
                              ${token.price}
                            </p>
                            <div className='flex items-center text-gray-50 px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'>
                              <ChangeArrow
                                changeType={randomChangeType()}
                                change={randomNumber()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
