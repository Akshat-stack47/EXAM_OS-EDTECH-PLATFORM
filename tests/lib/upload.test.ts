import { describe, it, expect, vi } from 'vitest'

const mockCreateSignedUploadUrl = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        createSignedUploadUrl: (...args: any[]) => mockCreateSignedUploadUrl(...args),
      }),
    },
  },
}))

const { uploadService } = await import('@/lib/upload')

describe('uploadService', () => {
  it('rejects disallowed file type for STUDENT', async () => {
    await expect(
      uploadService.getPresignedUrl('STUDENT', 'application/exe', 1000),
    ).rejects.toThrow()
  })

  it('rejects oversized file for STUDENT', async () => {
    await expect(
      uploadService.getPresignedUrl('STUDENT', 'application/pdf', 11 * 1024 * 1024),
    ).rejects.toThrow()
  })

  it('accepts valid file type and size for STUDENT', async () => {
    mockCreateSignedUploadUrl.mockResolvedValue({
      data: { signedUrl: 'https://example.com/upload', path: 'student/uuid.pdf' },
      error: null,
    })
    const result = await uploadService.getPresignedUrl('STUDENT', 'application/pdf', 5 * 1024 * 1024)
    expect(result.url).toBeDefined()
    expect(result.path).toContain('student/')
  })
})
