import { ArrowSmUpIcon, SparklesIcon } from '@heroicons/react/solid';
import { randomNumber } from '../utils/misc';

export default function TokenDetails({ token }) {
  return (
    <div className='backdrop-filter backdrop-blur-md bg-gray-800/50 shadow rounded-lg p-3 min-h-full'>
      <div className='flex flex-col justify-between'>
        <div>
          <div className='flex justify-between'>
            <h3 className='ml-1 flex align-middle text-2xl font-semibold leading-7 text-white sm:truncate'>
              🥩 Stake
            </h3>
          </div>
          <div className='mx-1 mt-2 text-md text-gray-50'>
            Simply stake your TNY/UST LP tokens to earn 101% APY. <br />
            Rewards can be claimed to your wallet or used to back a token.
            <br />
            <br />
            <span className='ml-1 underline cursor-pointer hover:no-underline'>
              Ways to enjoy your stake
            </span>{' '}
            🍷
          </div>
        </div>

        <div>
          <div className='flex mt-14 justify-between'>
            <label
              htmlFor='email'
              className='block text-sm font-bold text-gray-200'>
              LP Tokens
            </label>
          </div>
          <div className='mt-1'>
            <input
              type='text'
              name='value'
              id='value'
              className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-lg border-gray-300 rounded-md'
              placeholder='0'
            />
          </div>
          <button
            type='button'
            className='mt-2 w-full items-center text-center p-4 border border-transparent shadow-sm text-md font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
            <SparklesIcon
              className='inline mb-1 h-5 w-5 mr-2'
              aria-hidden='true'
            />
            Stake LP
          </button>
        </div>
      </div>
    </div>
  );
}
