import StakeStats from '../components/stake-stats';
import StakePool from '../components/stake-pool';
import StakeStake from '../components/stake-stake';

const Stake = () => {
  return (
    <div>
      <div className='max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-white'>
          Pool, Stake & Back
        </h1>
      </div>
      <div className='max-w-5xl mx-auto px-4 mt-6 lg:px-8'>
        <StakeStats />

        <div className='flex justify-center mx-auto px-8'>
          <div className='flex-auto mr-4'>
            <StakePool />
          </div>
          <div className='flex-auto'>
            <StakeStake />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Stake;
