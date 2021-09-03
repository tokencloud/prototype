import dynamic from 'next/dynamic';

const CreatorTokenChart = dynamic(
  () => import('../components/creator-token-chart'),
  { ssr: false }
);

const Tokenomics = () => {
  return (
    <div>
      <div className='max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-white'>Tokenomics</h1>
      </div>
      <div className='max-w-4xl mx-auto px-4 mt-6 lg:px-8'>
        <div className='backdrop-filter backdrop-blur-md bg-gray-800/50 shadow overflow-hidden rounded-md'>
          <CreatorTokenChart />
        </div>
      </div>
    </div>
  );
};
export default Tokenomics;
