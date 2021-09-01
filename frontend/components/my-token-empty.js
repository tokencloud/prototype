import { PlusIcon, StopIcon } from '@heroicons/react/solid';

export default function MyTokenEmpty() {
  return (
    <div className='text-center mb-12'>
      <StopIcon
        className='mx-auto h-24 w-24 text-gray-300'
        aria-hidden='true'
      />

      <h3 className='mt-2 text-md font-medium text-gray-600'>
        Your minted tokens & NFTs will appear here
      </h3>
      <p className='mt-1 text-md text-gray-500'>
        Get started by creating a token or NFT.
      </p>
      <div className='mt-6'>
        <a href='/create'>
          <button
            type='button'
            className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
            <PlusIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
            Create Token
          </button>
        </a>
      </div>
    </div>
  );
}
