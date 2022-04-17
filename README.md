# ENS Light ❄

### Giga tiny function to get ENS name of an address

## Installation

```
npm install ens-light
```

## Usage

### 📝. Simple use case

```js
import { getENS } from "ens-light"

const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

const ensName = await getENS(address)

console.log(ensName)
// "vitalik.eth"

const withAvatar = await getENS(address, { includeAvatar: true })

console.log(withAvatar)
// {
//  name: 'vitalik.eth',
//  avatar: 'https://metadata.ens.domains/mainnet/avatar/vitalik.eth'
// }
```

### ⚛️. React custom hook

```js
import * as React from "react"
import { getENS } from "ens-light"

export const useENS = (address, { includeAvatar = false } = {}) => {
	const [ens, setENS] = React.useState({ name: null, avatar: null })

	React.useEffect(() => {
		getENS(address, { includeAvatar }).then(({ name, avatar }) => {
			// You might want to cache in localStorage
			// and check that first instead of fetching every time
			setENS({ name, avatar })
		})
	}, [address, includeAvatar])

	return ens
}

export default function App() {
	const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
	const { name, avatar } = useENS(address, { includeAvatar: true })

	return (
		<figure>
			<img src={avatar} alt={name} height={200} width={200} />
			<figcaption>{name}</figcaption>
		</figure>
	)
}
```
