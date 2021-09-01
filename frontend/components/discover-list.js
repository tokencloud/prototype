import { useRouter } from 'next/router';
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';
import DiscoverChart from './discover-chart';

const tokens = [
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
    name: 'Kirby Token',
    role: 'KBY',
    change: '12%',
    changeType: 'increase',
    price: '$43.33',
    href: '/token',
    imageUrl:
      'https://eu.ui-avatars.com/api/?name=KBY&background=3167e3&color=fff',
  },
  {
    name: 'Nixon Token',
    role: 'NXN',
    change: '3%',
    changeType: 'decrease',
    price: '$1.28',
    href: '/token',
    imageUrl:
      'https://eu.ui-avatars.com/api/?name=NXN&background=6D28D9&color=fff',
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
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DiscoverList() {
  const router = useRouter();

  const _handleClick = (href) => {
    router.push(href);
  };

  return (
    <div className='flex flex-col max-w-4xl mx-auto'>
      <h3 className='text-lg leading-6 mt-10 mb-4 font-medium text-white'>
        Token Leaderboard
      </h3>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden backdrop-filter backdrop-blur-md bg-gray-400/50 rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
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
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {tokens.map((tokens) => (
                  <tr
                    key={tokens.email}
                    onClick={() => _handleClick(tokens.href)}
                    className='cursor-pointer hover:bg-gray-50/5'>
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
                          <div className='text-sm text-gray-700'>
                            {tokens.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-md text-center text-gray-900'>
                        {tokens.price}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
         
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
