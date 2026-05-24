const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE_MB = 10

export function validateUpload(file: { type: string; size: number; name: string }): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`)
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File too large. Max ${MAX_SIZE_MB}MB`)
  }
  if (file.name.endsWith('.svg') || file.type === 'image/svg+xml') {
    throw new Error('SVG files not allowed (XSS risk)')
  }
}
