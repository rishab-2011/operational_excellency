import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { brotliDecompressSync } from 'node:zlib'
import { createHash } from 'node:crypto'

const source = 'deploy-assets/application-support-v2.html.br.b64'
const destination = 'public/application-support/index.html'
const expectedSha256 = '35591d77f8a7e33a575a599f2d2e0750c4ecdaf9972ea6616c3ca95e2dee94e9'

const content = brotliDecompressSync(Buffer.from(readFileSync(source, 'utf8').trim(), 'base64'))
const actualSha256 = createHash('sha256').update(content).digest('hex')
if (actualSha256 !== expectedSha256) {
  throw new Error(`Executive proposal checksum mismatch: ${actualSha256}`)
}
mkdirSync('public/application-support', { recursive: true })
writeFileSync(destination, content)
console.log(`Restored ${destination} (${content.length} bytes; SHA-256 verified)`)
