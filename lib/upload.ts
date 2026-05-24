import { supabase } from '@/lib/supabase'
import { AppError } from '@/lib/app-error'

const ALLOWED_TYPES: Record<string, string[]> = {
  STUDENT: ['image/png', 'image/jpeg', 'application/pdf'],
  TEACHER: ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.ms-powerpoint', 'video/mp4'],
  COORDINATOR: ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.ms-powerpoint', 'video/mp4'],
}

const MAX_SIZES: Record<string, number> = {
  STUDENT: 10 * 1024 * 1024,
  TEACHER: 500 * 1024 * 1024,
  COORDINATOR: 500 * 1024 * 1024,
}

export const uploadService = {
  async getPresignedUrl(role: string, fileType: string, fileSize: number, bucket = 'uploads') {
    const allowed = ALLOWED_TYPES[role] ?? ALLOWED_TYPES.STUDENT
    if (!allowed.includes(fileType)) {
      throw AppError.validation(`File type ${fileType} not allowed for ${role}`)
    }

    const maxSize = MAX_SIZES[role] ?? MAX_SIZES.STUDENT
    if (fileSize > maxSize) {
      throw AppError.validation(`File size ${fileSize} exceeds limit of ${maxSize}`)
    }

    const ext = fileType.split('/')[1] ?? 'bin'
    const filePath = `${role.toLowerCase()}/${crypto.randomUUID()}.${ext}`

    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath)
    if (error) throw AppError.internal(`Failed to create upload URL: ${error.message}`)

    return { url: data.signedUrl, path: filePath }
  },

  async getSignedDownloadUrl(path: string, bucket = 'uploads', expiresIn = 900) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
    if (error) throw AppError.internal(`Failed to create download URL: ${error.message}`)
    return data.signedUrl
  },

  async deleteFile(path: string, bucket = 'uploads') {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw AppError.internal(`Failed to delete file: ${error.message}`)
  },
}
