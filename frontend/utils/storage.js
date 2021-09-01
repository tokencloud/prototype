import { Web3Storage } from 'web3.storage';

function makeStorageClient() {
  return new Web3Storage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJjQjA5ZDQ2NTk2QzkyMDY4MDI3RDZmOTk5MTJiNzQ3RkVmN2EwMzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzA0MjM3NjU0ODQsIm5hbWUiOiJUaW55VGVycmEifQ.W7V37vhbKZthvuX6sp3ecUdRXUj4Oj9sfuahqsWU5XM',
  });
}

export async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files, { wrapWithDirectory: false });
  return cid;
}
