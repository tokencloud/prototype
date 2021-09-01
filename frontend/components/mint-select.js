import { StopIcon, PhotographIcon } from '@heroicons/react/outline';

const actions = [
  {
    title: 'CW20 Token',
    href: '#',
    icon: StopIcon,
    iconForeground: 'text-white',
    iconBackground: 'bg-indigo-700',
    description: 'Create a fungible token on the Terra blockchain (CosmWasm)',
  },
  {
    title: 'CW721 NFT',
    href: '#',
    icon: PhotographIcon,
    iconForeground: 'text-white',
    iconBackground: 'bg-indigo-700',
    description:
      'Create a non-fungible token on the Terra blockchain (CosmWasm)',
  },
  {
    title: 'ERC20 Token',
    href: '#',
    icon: StopIcon,
    iconForeground: 'text-white',
    iconBackground: 'bg-indigo-700',
    description: 'Create a fungible token on the Ethereum blockchain',
  },

  {
    title: 'ERC721 NFT',
    href: '#',
    icon: PhotographIcon,
    iconForeground: 'text-white',
    iconBackground: 'bg-indigo-700',
    description: 'Create a non-fungible token on the Ethereum blockchain',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateSelect({ setSelected }) {
  const _handleClick = (e) => {
    e.preventDefault();
    setSelected(true);
  };
  return (
    <div className='rounded-lg backdrop-filter backdrop-blur-md bg-gray-800/50 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px'>
      {actions.map((action, actionIdx) => (
        <div
          key={action.title}
          className={classNames(
            actionIdx === 0
              ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
              : '',
            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
            actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
            actionIdx === actions.length - 1
              ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
              : '',
            'relative group text-center hover:bg-gray-800/20 transition duration-500 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
          )}>
          <div>
            <span
              className={classNames(
                action.iconBackground,
                action.iconForeground,
                'rounded-lg inline-flex p-3'
              )}>
              <action.icon className='h-12 w-12' aria-hidden='true' />
            </span>
          </div>
          <div className='mt-5'>
            <h3 className='text-lg font-medium text-white'>
              <a href='' onClick={_handleClick} className='focus:outline-none'>
                {/* Extend touch target to entire panel */}
                <span className='absolute inset-0' aria-hidden='true' />
                {action.title}
              </a>
            </h3>
            <p className='mt-2 text-md font-light text-gray-200'>
              {action.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
