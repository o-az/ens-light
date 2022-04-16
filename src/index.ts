export async function getENS(
	address: string,
	{
		includeAvatar = false,
	}: {
		includeAvatar?: boolean
	} = {}
): Promise<{ name: string; avatar?: string }> {
	const resolver = await getResolver(address)
	const { result, error } = await rpcRequest({
		address,
		hashedMethodSig: "0x691f3431",
		to: resolver,
	})
	if (error || !result) {
		throw new Error(error?.message || "yikes, query failed")
	}
	const name = hexToString(result)
	if (!includeAvatar) return { name }
	const avatar = await getAvatar(name)
	return { name, avatar }
}

async function rpcRequest({
	address,
	hashedMethodSig,
	to,
}: {
	address: string
	hashedMethodSig: string
	to: string
}): Promise<{
	"jsonrpc": "2.0"
	"id": 1
	"result"?: string
	"error"?: { "code": number; "message": string }
}> {
	const hashedAddress = await namehash(address)
	const response = await fetch("https://cloudflare-eth.com/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"jsonrpc": "2.0",
			"method": "eth_call",
			"id": 1,
			"params": [
				{ "data": `${hashedMethodSig}${hashedAddress}`, to },
				"latest",
			],
		}),
	})
	return await response.json()
}

async function getAvatar(name: string): Promise<string> {
	const url = `https://metadata.ens.domains/mainnet/avatar/${name}`
	const response = await fetch(url, { method: "HEAD" })
	if (response.status !== 200) {
		return "There is no avatar set under given address"
	}
	return `https://metadata.ens.domains/mainnet/avatar/${name}`
}

function hexToString(hex: string) {
	let string = ""
	for (let i = 0; i < hex.length; i += 2) {
		string += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
	}
	// remove spaces and trailing null bytes and \u000
	return string
		.replace(/\0/g, "")
		.replace(/\s/g, "")
		.replace(/\u000/g, "")
		.trim()
}

/**
 * Different addresses can require different resolvers.
 * i.e., different "to" destination in the rpcRequest.
 * For example:
 *                address                                     resolver
 * 0x54c375c481f95ba43e2cEcd6Ef30631f55518f57 -> 0xa2c122be93b0074270ebee7f6b7292c7deb45047
 * 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 -> 0x5fbb459c49bb06083c33109fa4f14810ec2cf358
 */
async function getResolver(address: string) {
	const { result, error } = await rpcRequest({
		address,
		hashedMethodSig: "0x0178b8bf",
		to: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
	})
	if (error || !result) return ""
	const resolver = `0x${result.slice(26, 66)}`
	return resolver
}

async function namehash(address: string) {
	const { keccak256 } =
		typeof window !== undefined ? await import("js-sha3") : require("js-sha3")
	let bytes = "00".repeat(32)
	const normalized = normalizer(address)
	const labels = ["reverse", "addr", normalized.slice(2).toLowerCase()]
	labels.map(label => {
		const labelSha = keccak256(label)
		const buffer = Buffer.from(bytes + labelSha, "hex")
		bytes = keccak256(buffer)
	})
	return bytes
}
function normalizer(
	name: string,
	{
		useStd3ASCII = true,
		transitional = false,
	}: {
		useStd3ASCII?: boolean
		transitional?: boolean
	} = {}
) {
	const nameNormalized = name.toLowerCase()
	const nameNormalizedStd3ASCII = useStd3ASCII
		? nameNormalized.normalize("NFKC")
		: nameNormalized
	const nameNormalizedTransitional = transitional
		? nameNormalizedStd3ASCII.normalize("NFKC")
		: nameNormalizedStd3ASCII
	return nameNormalizedTransitional
}
