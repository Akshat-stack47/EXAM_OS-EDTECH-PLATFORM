const ALGORITHM = 'AES-GCM'

const KEY_STR: string = process.env.HEALTH_ENCRYPTION_KEY ?? ''
if (!KEY_STR) {
  throw new Error('HEALTH_ENCRYPTION_KEY not set in environment')
}

function base64Encode(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function base64Decode(str: string): Uint8Array {
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(KEY_STR.padEnd(32, 'x').slice(0, 32))
  return crypto.subtle.importKey('raw', keyData, ALGORITHM, false, ['encrypt', 'decrypt'])
}

export async function encrypt(text: string): Promise<string> {
  const key = await getKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoder = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(text),
  )
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return base64Encode(combined)
}

export async function decrypt(encoded: string): Promise<string> {
  const key = await getKey()
  const combined = base64Decode(encoded)
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data,
  )
  return new TextDecoder().decode(decrypted)
}
