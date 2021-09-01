import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';

export default function PriceArrow({ change, changeType }) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div
        className={classNames(
          changeType === 'increase' ? 'text-green-500' : 'text-red-500',
          'inline-flex items-baseline'
        )}>
        {changeType === 'increase' ? (
          <ArrowSmUpIcon
            className='-ml-1  flex-shrink-0 self-center h-5 w-5 text-green-500'
            aria-hidden='true'
          />
        ) : (
          <ArrowSmDownIcon
            className='-ml-1  flex-shrink-0 self-center h-5 w-5 text-red-500'
            aria-hidden='true'
          />
        )}
        {change}%
      </div>
    </>
  );
}
