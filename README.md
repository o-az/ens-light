# getENS(\<address>\)

### Giga tiny function to get ENS name of an address

## Installation

```
npm install give-ens-name
```

## Usage

### 📝 Simple use case

```ts
import { getENS } from "give-ens-name"

const ensName = await getENS("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")

console.log(ensName)
// -> "vitalik.eth"

const withAvatar = await getENS(
 "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
 { includeAvatar: true }
)

console.log(withAvatar)
// {
//  name: 'vitalik.eth',
//  avatar: 'https://metadata.ens.domains/mainnet/avatar/vitalik.eth'
// }
```

### ⚛️ React custom hook

```ts
import * as React from "react"
import { getENS } from "give-ens-name"

export const useENS = (address: string) => {
 const [ensName, setEnsName] = React.useState<string | null>(null)

 React.useEffect(() => {
  getENS(address).then(setEnsName)
 }, [address])

 return ensName
}

export default function App() {
 const ensName = useENS("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")

 return <div>{ensName}</div>
}
```
