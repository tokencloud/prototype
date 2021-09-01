import { useState } from 'react';
import TradeModal from './trade-modal';
import {
  ArrowSmUpIcon,
  CalendarIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';
import { randomNumber } from '../utils/misc';

export default function TokenDetails({ token }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <>
      <TradeModal open={open} setOpen={setOpen} token={token} value={value} />
      <div className='backdrop-filter backdrop-blur-md bg-gray-800/50 shadow rounded-lg p-3 min-h-full'>
        <div className='flex flex-col space-y-32  justify-between'>
          <div>
            <div className='flex justify-between'>
              <h3 className='ml-1 flex align-middle text-2xl font-semibold leading-7 text-white sm:text-3xl sm:truncate'>
                ${token.price}
              </h3>

              <div className='text-green-500 inline-flex py-2 px-1 rounded-full text-md font-medium'>
                <ArrowSmUpIcon
                  className='-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500'
                  aria-hidden='true'
                />
                {randomNumber()}%
              </div>
            </div>
            <div className='mx-1 mt-2 text-sm text-gray-50'>
              {token.description + ' '}
              <span className='ml-1 underline'>Learn more</span>
            </div>
            <div className='pt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6'>
              <div className='mt-2 flex items-center text-sm text-gray-50'>
                <CalendarIcon
                  className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                Minted {Math.floor(Math.random() * 12)} days ago
              </div>
            </div>
          </div>

          <div>
            <div className='flex justify-between'>
              <label
                htmlFor='email'
                className='block text-sm font-bold text-gray-200'>
                Buy {token.symbol}
                <span className='ml-2 underline text-gray-100 font-medium cursor-pointer hover:text-gray-600 hover:font-bold'>
                  Sell {token.symbol}
                </span>
              </label>
              <span className='text-sm text-gray-400' id='email-optional'>
                6.84 TNY per {token.symbol}
              </span>
            </div>
            <div className='mt-1'>
              <input
                type='number'
                name='value'
                id='value'
                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-lg border-gray-300 rounded-md'
                value={value}
                onInput={(e) => setValue(e.target.value)}
              />
            </div>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault;
                setOpen(true);
              }}
              className='mt-2 w-full items-center text-center p-4 border border-transparent shadow-sm text-md font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <SwitchHorizontalIcon
                className='inline h-5 w-5 mr-2'
                aria-hidden='true'
              />
              Trade
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
