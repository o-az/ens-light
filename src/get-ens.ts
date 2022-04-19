import { keccak256 } from "js-sha3"

export async function getENS(
	address: string,
	{
		includeAvatar = false
	}: {
		includeAvatar?: boolean
	} = {}
): Promise<{ name: string; avatar?: string }> {
	const resolver = await getResolver(address)
	const { result, error } = await rpcRequest({
		address,
		hashedMethodSig: "0x691f3431",
		to: resolver
	})
	if (error || !result) {
		console.trace(error)
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
	to
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
	const hashedAddress = namehash(address)
	const response = await fetch("https://api.mycryptoapi.com/eth", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			method: "eth_call",
			id: 2,
			params: [{ "data": `${hashedMethodSig}${hashedAddress}`, to }, "latest"]
		})
	})
	return await response.json()
}

async function getAvatar(name: string): Promise<string> {
	const response = await fetch(
		`https://metadata.ens.domains/mainnet/avatar/${name}`,
		{ method: "HEAD" }
	)
	if (response.status !== 200) {
		return "There is no avatar set under given address"
	}
	return `https://metadata.ens.domains/mainnet/avatar/${name}`
}

// Different addresses can require different resolvers.
async function getResolver(address: string) {
	const { result, error } = await rpcRequest({
		address,
		hashedMethodSig: "0x0178b8bf",
		to: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
	})
	if (error || !result) return ""
	return `0x${result.slice(26, 66)}`
}

function hexToString(hex: string) {
	let string = ""
	for (let i = 0; i < hex.length; i += 2) {
		string += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
	}
	// remove spaces and trailing null bytes and \u000
	return string
		.replace(/\0/g, "")
		.replace(/\s/g, "")
		.replace(/\u000/g, "")
		.trim()
}

function namehash(address: string) {
	let bytes = "00".repeat(32)
	const labels = ["reverse", "addr", normalizer(address).slice(2).toLowerCase()]
	labels.map(label => {
		const buffer = Buffer.from(bytes + keccak256(label), "hex")
		bytes = keccak256(buffer)
	})
	return bytes
}

function normalizer(n: string) {
	return n.toLowerCase().normalize("NFKC")
}
