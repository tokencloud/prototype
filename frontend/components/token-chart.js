import React from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

function randomArray() {
  return Array.from({ length: 20 }, () => Math.floor(Math.random() * 40));
}

export default function TokenChart() {
  return (
    <div className='backdrop-filter backdrop-blur-md bg-gray-800/50 shadow rounded-lg py-3 px-5'>
      <div className='text-center'>
        <div className='relative pb-12 my-auto'>
          <Sparklines data={randomArray()} width={200} height={100} margin={5}>
            <SparklinesLine
              style={{
                strokeWidth: 4,
                stroke: '#6366F1',
                fill: 'none',
              }}
            />
            <SparklinesSpots
              size={2}
              style={{
                stroke: 'white',
                strokeWidth: 3,
                fill: 'white',
              }}
            />
          </Sparklines>

          <div className='text-left mt-6 mb-2 font-light text-lg text-white'>
            Tokenomics
          </div>

          <ProgressBar progressPercentage={70} />
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className='h-10 w-full bg-gray-800/50 rounded-lg'>
      <div
        style={{ marginLeft: '90%' }}
        className='absolute mt-1 text-white font-semibold text-xs'>
        10,000 FIR
      </div>
      <div
        style={{ marginLeft: `${progressPercentage - 6.5}%` }}
        className='text-white
        absolute mt-12'>
        <div className='h-8 pt-1 px-1 w-30 rounded-lg bg-indigo-600 relative'>
          🔥 3,700 left
          <div className='absolute -top-2 left-6 h-0 w-0 border-8 bg-indigo-600 transform border-b-transparent border-r-transparent rotate-45'></div>
        </div>
      </div>
      <div
        style={{ marginLeft: `${progressPercentage / 3}%` }}
        className='text-white text-xs absolute mt-12'>
        💰 Backed by $343 in TNY
      </div>

      <div
        style={{ width: `${progressPercentage}%` }}
        className={`relative h-full rounded-lg ${
          progressPercentage < 70 ? 'bg-orange-800' : 'bg-indigo-600'
        }`}>
        <div
          style={{ width: `${progressPercentage}%` }}
          className={`absolute h-full rounded-lg ${
            progressPercentage / 3 < 70 ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}></div>
      </div>
    </div>
  );
};
