import Identicon from 'identicon.js';
const people = [
  {
    address: 'terra1rd37efmhvscdjcpakqxym68zv9da7uvt5ld62y',
  },
];

export default function Addresses() {
  function _generateIcon(id) {
    var options = {
      foreground: [51, 51, 153, 255], // rgba black
      background: [200, 200, 200, 255], // rgba white
      margin: 0.2, // 20% margin
      size: 420, // 420px square
      format: 'png', // use SVG instead of PNG
    };
    return new Identicon(id, options).toString();
  }
  return (
    <div className='grid grid-cols-1'>
      {people.map((person) => (
        <div
          key={person.address}
          className='relative rounded-lg bg-gray-700 m-1 px-6 py-5 shadow-sm flex items-center space-x-2 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
          <div className='flex-shrink-0'>
            <img
              className='h-10 w-10 rounded-full'
              src={`data:image/png;base64,` + _generateIcon(person.address)}
              alt=''
            />
          </div>
          <div className='flex-1 min-w-0'>
            <a href='#' className='focus:outline-none'>
              <span className='absolute inset-0' aria-hidden='true' />
              <p className='text-sm font-medium text-gray-100 truncate'>
                {person.address}
              </p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
