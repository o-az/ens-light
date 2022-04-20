const reqInit: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' } }

const TEXT_HASHED_METHOD_SIG = '0x59d1d43c'
type TextRecordKey = 'url' | 'avatar' | 'description'

const prepend = '0'.repeat(62) + '4' + '0'.repeat(64)

type TextRecords = Record<TextRecordKey, string>

const TEXT_RECORDS: TextRecords = {
  url: `${prepend}375726c`,
  avatar: `${prepend}6617661746172`,
  description: `${prepend}b6465736372697074696f6e`
}

interface QueryResult {
  data: Record<
    'domains',
    | Array<{
        name: string
        owner: { address: string }
        resolver: { texts: TextRecordKey[] | null; id: string }
      }>
    | []
  >
}

getENS('0x9FB7E6090096C3A0a6b085C8e33d99e5610234fa', { includeAvatar: true }).then(_ =>
  console.log(JSON.stringify(_, null, 2))
)

export async function getENS(
  userAddress: string,
  { includeAvatar = false } = {}
): Promise<{
  name: string | null
  address: string
  textRecords?: TextRecords
}> {
  const response = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
    ...reqInit,
    body: JSON.stringify({
      query: `{
        domains(where: {
          resolvedAddress: "${userAddress.toLowerCase()}",
          name_ends_with: ".eth"
        }, orderDirection: asc, orderBy: createdAt, first: 10) {
          name
          owner { address: id }
          resolver { texts, id }
        }
      }`,
      variables: { address: userAddress.toLowerCase() }
    })
  })
  const { data }: QueryResult = await response.json()
  if (!data) return { address: userAddress, name: null }
  const { domains } = data
  if (!domains.length) return { address: userAddress, name: null }
  const [
    {
      name,
      owner: { address },
      resolver: { texts, id }
    }
  ] = !includeAvatar ? domains : domains.filter(({ resolver: { texts } }) => !!texts)
  if (!texts || !includeAvatar) return { address, name }
  const textRecords = await getENSTextRecords({ resolvedId: id, texts })
  return { name, address, textRecords }
}

type TextRecordsRequest = { resolvedId: string; texts: TextRecordKey[] }

async function getENSTextRecords({ resolvedId, texts }: TextRecordsRequest): Promise<TextRecords> {
  if (resolvedId.indexOf('-') === -1 || !texts.length) return {} as TextRecords
  const [to, content] = resolvedId.split('-')
  let records = {} as TextRecords
  texts.filter(_ => !!TEXT_RECORDS[_]).map(_ => (records[_] = TEXT_RECORDS[_]))
  const formatData = Object.values(records).map(record => `${TEXT_HASHED_METHOD_SIG}${content.slice(2)}${record}`)
  const promises = await Promise.allSettled(
    formatData.map(
      async data =>
        await fetch('https://api.mycryptoapi.com/eth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            id: 2,
            params: [{ data, to }, 'latest']
          })
        })
          .then(res => res.json())
          .then(({ result }) => result)
          .catch(err => console.log(err))
    )
  )
  const fullfilled = promises.filter(({ status }) => status === 'fulfilled') as PromiseFulfilledResult<{
    jsonrpc: '2.0'
    id: 1
    result?: string
    error?: { code: number; message: string }
  }>[]
  const result = fullfilled.map(({ value }) => hexToString(`${value}`))
  Object.keys(records).map((_, idx) => (records[_ as TextRecordKey] = result[idx]))
  return records
}

function hexToString(hex: string) {
  let string = ''
  for (let i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
  }
  return string.replace(/\0/g, '').replace(/\u000/g, '').trim()
}
