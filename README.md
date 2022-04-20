
# ENS Light ❄
### Super tiny function to get ENS name of an address
## Installation
```
npm install ens-light
```
## Usage
### 📝 Simple use case
```ts
import { getENS } from 'ens-light';

const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
getENS(address).then(console.log)
// "vitalik.eth"

getENS(address, { includeAvatar: true }).then(console.log)
// {
//  name: 'vitalik.eth',
//  avatar: 'https://metadata.ens.domains/mainnet/avatar/vitalik.eth'
// }
```

### ⚛️ React custom hook ([see it in action and play with it](https://stackblitz.com/edit/react-ts-rfohuw?file=index.tsx))
```ts
import * as React from 'react';
import { getENS } from 'ens-light';

type UseENS = (
  address: string,
  { includeAvatar: boolean }
) => [name: string, avatar: string];

export const useENS: UseENS = (address, { includeAvatar }) => {
  const [[name, avatar], setENS] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    const getAndSetEnsData = async () => {
      const { name, avatar } = await getENS(address, { includeAvatar });
      setENS(() => [name, avatar]);
    };
    getAndSetEnsData();
  }, [address, includeAvatar]);

  return [name, avatar];
};

export default function App() {
  const [name, avatar] = useENS('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', {
    includeAvatar: true,
  });

  return (
    <figure>
      <img src={avatar} alt={name} height={200} width={200} />
      <figcaption>{name}</figcaption>
    </figure>
  );
}
```
