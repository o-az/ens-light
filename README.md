# giveEnsName(\<address>\)

###

### Giga tiny function to get ENS name of an address. You can use it in your own code

---

## Installation

```
npm install give-ens-name
```

## Usage

### 📝 Simple use case

```ts
import { giveEnsName } from "give-ens-name"

const ensName = await giveEnsName("0x60abfaab599b78660d994ccfcca44668945e519d")

console.log(ensName)
// -> "sillos.eth"
```

### ⚛️ React custom hook

```ts
import * as React from "react"
import { useGiveEnsName } from "give-ens-name"

export const useENS = (address: string) => {
	const [ensName, setEnsName] = React.useState<string | null>(null)

	React.useEffect(() => {
		giveEnsName(address).then(setEnsName)
	}, [address])

	return ensName
}

export default function App() {
	const ensName = useENS("0x60abfaab599b78660d994ccfcca44668945e519d")

	return <div>{ensName}</div>
}
```
