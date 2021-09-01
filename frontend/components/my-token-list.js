import { useRouter } from 'next/router';
import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  CogIcon,
} from '@heroicons/react/solid';
import DiscoverChart from './discover-chart';

const tokens = [
  {
    name: 'Silvia Art NFT',
    role: 'SLA',
    change: '29%',
    changeType: 'increase',
    price: '$89.22',
    href: '/token',
    imageUrl:
      'https://eu.ui-avatars.com/api/?name=SLA&background=DC2626&color=fff',
  },
  {
    name: 'Fire Token',
    role: 'FRE',
    change: '8%',
    changeType: 'increase',
    price: '$12.87',
    href: '/token',
    imageUrl:
      'https://eu.ui-avatars.com/api/?name=FIR&background=FFFF00&color=ffa500',
  },
  {
    name: 'Delike Token',
    role: 'DDE',
    change: '18%',
    changeType: 'increase',
    price: '$0.88',
    href: '/token',
    imageUrl:
      'https://eu.ui-avatars.com/api/?name=DDE&background=000&color=fff',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function MyTokenList() {
  const router = useRouter();

  const _handleClick = (href) => {
    router.push(href);
  };

  return (
    <div className='flex flex-col'>
      <h3 className='text-lg leading-6 mb-4 font-medium text-white'>
        My Tokens ({tokens.length})
      </h3>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Token
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    UST
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    24hr
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Performance
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {tokens.map((tokens) => (
                  <tr
                    key={tokens.email}
                    onClick={() => _handleClick(tokens.href)}
                    className='cursor-pointer hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <img
                            className='h-10 w-10 rounded-full'
                            src={tokens.imageUrl}
                            alt=''
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-md font-medium text-gray-900'>
                            {tokens.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {tokens.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-md text-gray-900'>
                        {tokens.price}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={classNames(
                          tokens.changeType === 'increase'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                          'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'
                        )}>
                        {tokens.changeType === 'increase' ? (
                          <ArrowSmUpIcon
                            className='-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500'
                            aria-hidden='true'
                          />
                        ) : (
                          <ArrowSmDownIcon
                            className='-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500'
                            aria-hidden='true'
                          />
                        )}

                        <span className='sr-only'>
                          {tokens.changeType === 'increase'
                            ? 'Increased'
                            : 'Decreased'}{' '}
                          by
                        </span>
                        {tokens.change}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <DiscoverChart />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <a
                        href='/edit'
                        className='inline-flex px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'>
                        <CogIcon
                          className='inline mr-1 h-5 w-5'
                          aria-hidden='true'
                        />{' '}
                        Manage
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
