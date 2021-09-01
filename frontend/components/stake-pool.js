import { ScaleIcon, ArrowRightIcon } from '@heroicons/react/solid';

export default function TokenDetails({ token }) {
  return (
    <div className='backdrop-filter backdrop-blur-md bg-gray-800/50 shadow rounded-lg p-3 min-h-full'>
      <div className='flex flex-col justify-between'>
        <div>
          <div className='flex justify-between'>
            <h3 className='ml-1 flex align-middle text-2xl font-semibold leading-7 text-white sm:truncate'>
              🏝️ Pool
            </h3>

            <div className='text-green-500 inline-flex py-2 px-1 rounded-full text-sm font-medum'>
              Hint: Pool then Stake
              <ArrowRightIcon
                className='ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500'
                aria-hidden='true'
              />
            </div>
          </div>
          <div className='mx-1 mt-2 text-md text-gray-50'>
            Supply liquidity to the TNY/UST pool.
            <br />
            <br />
            <span className='ml-1 underline cursor-pointer hover:no-underline'>
              Learn more
            </span>{' '}
            🌞
          </div>
          <div className='pt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6'></div>
        </div>

        <div>
          <div className='flex mt-4 justify-between'>
            <label
              htmlFor='email'
              className='block text-sm font-bold text-gray-200'>
              TNY
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

          <div className='font-medium text-white text-4xl text-center mt-2'>
            +
          </div>
          <div className='flex justify-between'>
            <label
              htmlFor='email'
              className='block text-sm font-bold text-gray-200'>
              UST
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
            <ScaleIcon
              className='inline mb-1 h-5 w-5 mr-2'
              aria-hidden='true'
            />
            Pool
          </button>
        </div>
      </div>
    </div>
  );
}
