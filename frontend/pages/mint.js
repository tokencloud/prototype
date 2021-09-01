import { useState } from 'react';

import MintSelect from '../components/mint-select';
import MintInput from '../components/mint-input';

const Create = () => {
  const [select, setSelected] = useState(false);

  return (
    <div>
      <div className='max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-white'>Mint a Token</h1>
      </div>
      <div className='max-w-4xl mx-auto px-4 mt-4 lg:px-8'>
        {!select && <MintSelect setSelected={setSelected} />}
        {select && <MintInput setSelected={setSelected} />}
      </div>
    </div>
  );
};
export default Create;
