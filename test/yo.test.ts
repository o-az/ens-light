import * as assert from "assert/strict"
import { getENS } from "../src"

const test_cases: [string, string][] = [
	["0xcc719d0ef7c044543efd2686695ded5f24978cf3", "skaret.eth"],
	["0x7a8699eaf965df7180a904601d17c71c3b7a6779", "skiareal.eth"],
	["0x668fc3c610b2cdb7cea8ca20075430d101d4d199", "beeplesfirst5000days.eth"],
	["0xcdf1fdaa361e59592bd66287b9df4343de654062", "bobbleheads.eth"],
	["0xf47ecf6e9af93b10eaa655e7036b00a5bc9d21d5", "ywnbaw.eth"],
	["0x408c081f643d9934f94629b92a700dd960c87260", "liveone.eth"],
	["0x5247299421a3ff724c41582e5a44c6551d135fd3", "carpe-diem.eth"],
	["0x60abfaab599b78660d994ccfcca44668945e519d", "jessedillow.eth"],
	["0x0abddcc3540fd08341d6e5f92cda196b5be89895", "ethereumwrapped.eth"],
	["0x84ecd8bae0fff81b722a24d4e00b010bd02691d4", "modernism.eth"],
	["0xae7f50a6e5d231dbdf6f4a80ddd9e3026394a874", "josemato.eth"],
	["0x2229113b5ec7bb7b539f5e9c4cd3717232f641c9", "cgiii.auth.eth"],
	["0xefb6b7387ecc7cc0a50a5938bb97d25e4f9d1e73", "fuckethereum.eth"],
	["0xb9bd55eb41a48dd8b3141a09c4c6d829b581cfeb", "nathanmiers.eth"],
	["0x7d0ce0a73c314bc52f1fa294a6d1be72fb0b4061", "hialeah.eth"],
	["0x6cacf20b5e3e5dfd76372539ed65d96610012c5a", "williamjjohnson.eth"],
	["0x5ef48ca7b8bb0aa63ac43258ca2a92b47e1b355b", "metaherb.eth"],
	["0x73b70b1fdbdcb7604661b2520035454c3e8bc5f5", "rossman6661.eth"],
	["0x86dbd1c433ecab6f2a6f724891f71b91e5f005b6", "dakkon.eth"],
	["0xec886201a7bcd0d26dd036dda4fe07bb4943d1de", "among.eth"],
	["0xda394ebbe74afa28a33aabbd358ce80b41928d9d", "jeffreybeer.eth"],
	["0xc63afcbce8a83f2ef3c8ece0763c2bebf3e13223", "scotttaylor.eth"],
	["0xfdc2b74e5b57c1594c70a01638188b5062199749", "2dgirls.eth"],
	["0x7b49d388db483cf4767f193640ad2aeead657099", "onewheel.stateofus.eth"],
]

test_cases.forEach(async ([address, name]) => {
	const { name: resolvedName } = await getENS(address)
	assert(
		resolvedName === name,
		`${address} resolved to ${resolvedName} instead of ${name}`
	)
})
