import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { TokensContext } from '../contexts/tokensContext';

import { storeFiles } from '../utils/storage';

import ReactDOM from 'react-dom';

// Import React FilePond
import { FilePond, File, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the plugin code
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

export default function CreateInput({ setSelected }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tokens, setTokens] = useContext(TokensContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log({ name });
    console.log({ symbol });
    console.log({ description });
    console.log({ file });

    const cid = await storeFiles(file);
    console.log('stored files with cid:', cid);

    setTokens([
      ...tokens,
      {
        name: name,
        symbol: symbol,
        description: description,
        price: 0.0,
        imageUrl: `https://ipfs.io/ipfs/${cid}`,
      },
    ]);
    setSelected(true);
    router.push('/');
  };

  return (
    <div>
      <form>
        <div className='shadow sm:rounded-md sm:overflow-hidden'>
          <div className='backdrop-filter backdrop-blur-md bg-gradient-to-t from-gray-800/50 to-gray-800/50 py-6 px-4 space-y-6 sm:p-6'>
            <div>
              <h3 className='text-lg leading-6 font-medium text-white'>
                🌱 CW20 Token
              </h3>
              <p className='mt-3 text-md font-light text-gray-50'>
                Minted tokens have a fixed supply of 10,000 tokens. As a
                creator, you'll receive 1,000 tokens, and 1,000 tokens will be
                held in the community treasury. Token issuance and price is
                based on a <span className='underline'>price demand curve</span>
                . Creator tokens can be{' '}
                <span className='underline'>backed by TNY tokens</span> to help
                drive demand 🚀
              </p>
            </div>

            <div className='grid grid-cols-4 gap-6'>
              <div className='col-span-4'>
                <div className='relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600'>
                  <label
                    htmlFor='name'
                    className='absolute -top-2 left-2 -mt-px inline-block px-1 bg-white rounded-md text-sm font-medium text-gray-800'>
                    📛 Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className='block pt-2 w-full border-0 p-0 bg-transparent text-white placeholder-gray-500 focus:ring-0 sm:text-md'
                    placeholder=''
                    minLength='5'
                    maxLength='50'
                    value={name}
                    onInput={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-span-4'>
                <div className='relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600'>
                  <label
                    htmlFor='symbol'
                    className='absolute -top-2 left-2 -mt-px inline-block px-1 bg-white rounded-md text-sm font-medium text-gray-800'>
                    💱 Symbol
                  </label>
                  <input
                    type='text'
                    name='symbol'
                    id='symbol'
                    className='block pt-2 w-full border-0 p-0 bg-transparent text-white placeholder-gray-500 focus:ring-0 sm:text-md'
                    placeholder=''
                    minLength='3'
                    maxLength='4'
                    value={symbol}
                    onInput={(e) => setSymbol(e.target.value)}
                  />
                </div>
              </div>

              <div className='col-span-4'>
                <div className='relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600'>
                  <label
                    htmlFor='description'
                    className='absolute -top-2 left-2 -mt-px inline-block px-1 bg-white rounded-md text-sm font-medium text-gray-800'>
                    📝 Description
                  </label>
                  <input
                    type='text'
                    name='description'
                    id='description'
                    className='block pt-2 w-full border-0 p-0 bg-transparent text-white placeholder-gray-500 focus:ring-0 sm:text-md'
                    placeholder=''
                    minLength='5'
                    maxLength='150'
                    value={description}
                    onInput={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className='col-span-4'>
                <label
                  htmlFor='description'
                  className='relative left-2 -mt-px inline-block px-1 bg-white rounded-md text-sm font-medium text-gray-800'>
                  🖼️ Logo
                </label>

                <FilePond
                  files={file}
                  allowFileTypeValidation={true}
                  acceptedFileTypes={['image/*']}
                  onupdatefiles={(fileItems) => {
                    setFile(fileItems.map((fileItem) => fileItem.file));
                  }}
                  allowMultiple={false}
                  maxFiles={1}
                  credits={false}
                  allowRevert={false}
                  allowProcess={false}
                  disabled={false}
                  name='files'
                  labelIdle='<span className="filepond--label-action">Select a file</span>'
                />
              </div>
            </div>

            {name !== '' &&
              description !== '' &&
              symbol !== '' &&
              file.length !== 0 && (
                <button
                  onClick={handleSubmit}
                  type='submit'
                  className='w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-6 inline-flex justify-center text-md font-medium text-white hover:bg-indigo-700 focus:outline-none'>
                  {isSubmitting ? (
                    <>
                      <div class='bg-blue-500 p-2  w-4 h-4 rounded-full animate-bounce blue-circle'></div>
                      <div class='bg-green-500 p-2 w-4 h-4 rounded-full animate-bounce green-circle'></div>
                      <div class='bg-red-500 p-2  w-4 h-4 rounded-full animate-bounce red-circle'></div>
                    </>
                  ) : (
                    <> Create Token </>
                  )}
                </button>
              )}
          </div>
        </div>
      </form>
    </div>
  );
}
