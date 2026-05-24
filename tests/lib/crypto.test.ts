import { describe, it, expect } from 'vitest'
import { encrypt, decrypt } from '@/lib/crypto'

describe('encrypt / decrypt', () => {
  it('round-trips a secret', async () => {
    const original = 'my secret data'
    const encoded = await encrypt(original)
    expect(encoded).not.toBe(original)
    const decoded = await decrypt(encoded)
    expect(decoded).toBe(original)
  })

  it('produces different ciphertext each time', async () => {
    const input = 'consistent input'
    const a = await encrypt(input)
    const b = await encrypt(input)
    expect(a).not.toBe(b)
  })

  it('handles empty string', async () => {
    const encoded = await encrypt('')
    const decoded = await decrypt(encoded)
    expect(decoded).toBe('')
  })
})
