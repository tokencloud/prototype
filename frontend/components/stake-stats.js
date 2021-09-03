export default function Example() {
  return (
    <div className='mt-2'>
      <div className='pb-12 sm:pb-16'>
        <div className='relative'>
          <div className='absolute inset-0 h-1/2' />
          <div className='relative mx-auto'>
            <div className='max-w-4xl mx-auto'>
              <dl className='rounded-lg backdrop-filter backdrop-blur-md bg-gray-800/50 shadow-lg sm:grid sm:grid-cols-4'>
                <div className='flex flex-col border-b border-gray-800/50 p-6 text-center sm:border-0 sm:border-r'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-light text-gray-200'>
                    💸 APY
                  </dt>
                  <dd className='order-1 text-3xl font-extrabold text-indigo-600'>
                    101%
                  </dd>
                </div>
                <div className='flex flex-col border-t border-b border-gray-800/50 p-6 text-center sm:border-0 sm:border-l sm:border-r'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-light text-gray-200'>
                    🥩 LP Staked
                  </dt>
                  <dd className='order-1 text-3xl font-extrabold text-indigo-600'>
                    420.69
                  </dd>
                </div>
                <div className='flex flex-col border-t border-gray-800/50 p-6 text-center sm:border-0 sm:border-l'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-light text-gray-200'>
                    🌎 TNY Rewards <br />
                    <span className='underline font-medium cursor-pointer hover:no-underline mr-2 text-sm'>
                      Claim to wallet
                    </span>
                    💰
                    <br />
                    <span className='underline font-medium cursor-pointer hover:no-underline text-sm mr-2'>
                      Back a token
                    </span>
                    🚀
                  </dt>
                  <dd className='order-1 text-3xl font-extrabold text-indigo-600'>
                    1043
                  </dd>
                </div>
                <div className='flex flex-col border-t border-gray-800/50 p-6 text-center sm:border-0 sm:border-l'>
                  <dt className='order-2 mt-2 text-lg leading-6 font-light text-gray-200'>
                    🪙 Available LP
                  </dt>
                  <dd className='order-1 text-3xl font-extrabold text-indigo-600'>
                    0.00
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
