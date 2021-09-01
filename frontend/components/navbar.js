import Link from 'next/link';

import { CashIcon } from '@heroicons/react/solid';
import ChangeArrow from './change-arrow';
import { randomChangeType, randomNumber } from '../utils/misc';

import { useMemo } from 'react';
import { useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";

export default function Navbar() {
  const {
    status,
    availableInstallTypes, install, // TODO: implement terra station install
    connect,
    disconnect,
  } = useWallet();

  const connectedWallet = useConnectedWallet();

  const addressInfo = useMemo(() => {
    if (connectedWallet) {
      const address = connectedWallet.terraAddress;
      const networkName = connectedWallet.network.name !== 'mainnet' ? `${connectedWallet.network.name} ` : '';
      return `${networkName}${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
    }
    return '';
  }, [connectedWallet]);


  return (
    <div className='bg-gradient-to-b from-black/70 via-black/50 to-transparent'>
      <div className='max-w-5xl mx-auto px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex-shrink-0 flex items-center'>
            <Link href='/'>
              <a>
                <img src='logo.png' className='h-10 w-auto' />
              </a>
            </Link>
          </div>
          <div className='ml-6 flex mb-2 space-x-8'>
            <a
              href='https://app.terraswap.io/#Swap'
              target='_blank'
              className='hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 hover:border-b-2 text-sm font-medium'>
              <span className='mr-1 font-semibold'>
                🌎 <span className='font-bold'>TNY $1.88</span>
              </span>
              <ChangeArrow
                change={randomNumber()}
                changeType={randomChangeType()}
              />
            </a>
            <Link href='/'>
              <a
                className='hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 hover:border-b-2 text-sm font-medium'>
                🚀 Leaderboard
              </a>
            </Link>

            <Link href='/stake'>
              <a
                className='hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 hover:border-b-2 text-sm font-medium'>
                🧑‍🌾 Stake
              </a>
            </Link>

            <Link href='/mint'>
              <a
                className='hover:border-indigo-500 text-white inline-flex items-center px-1 pt-1 hover:border-b-2 text-sm font-medium'>
                🏦 Mint
              </a>
            </Link>
          </div>
          <div className='hidden sm:flex items-center '>
            {status === WalletStatus.WALLET_NOT_CONNECTED ? (
              <button
                type='button'
                onClick={() => connect('CHROME_EXTENSION')}
                className='relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                <CashIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                <span>Connect</span>
              </button>
            ) : (
              <>
                <label htmlFor="disconnectButton">Disconnect</label>
                <button
                  id='disconnectButton'
                  onClick={() => disconnect()}
                  type='button'
                  title={"Disconnect from: " + addressInfo}
                  className='relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                  <CashIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                  <span>{addressInfo}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
