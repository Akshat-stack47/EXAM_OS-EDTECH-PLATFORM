type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogEntry = {
  level: LogLevel
  message: string
  timestamp: string
  requestId?: string
  userId?: string
  service?: string
  duration?: number
  error?: unknown
  [key: string]: unknown
}

const PII_FIELDS = ['email', 'phone', 'password', 'otp', 'token', 'secret', 'authorization', 'cookie', 'jwt', 'apiKey', 'aadhaar', 'pan', 'ssn', 'address']

function sanitize(entry: LogEntry): LogEntry {
  const sanitized = { ...entry }
  for (const key of Object.keys(sanitized)) {
    if (PII_FIELDS.some((f) => key.toLowerCase().includes(f))) {
      sanitized[key] = '[REDACTED]'
    }
  }
  if (typeof sanitized.message === 'string') {
    sanitized.message = sanitized.message.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    sanitized.message = sanitized.message.replace(/\b\d{10}\b/g, '[PHONE]')
  }
  delete sanitized.userId
  return sanitized
}

const AXIOM_URL = 'https://api.axiom.co'

async function sendToAxiom(entry: LogEntry): Promise<void> {
  const token = process.env.AXIOM_TOKEN
  const dataset = process.env.AXIOM_DATASET
  if (!token || !dataset) return

  try {
    await fetch(`${AXIOM_URL}/v1/datasets/${dataset}/ingest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([entry]),
    })
  } catch {
    // Fail silently — logging should never crash the app
  }
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'exam-os',
    ...meta,
  }

  const sanitized = sanitize(entry)
  const output = JSON.stringify(sanitized)

  switch (level) {
    case 'error':
      console.error(output)
      break
    case 'warn':
      console.warn(output)
      break
    default:
      console.log(output)
  }

  if (level === 'error' || level === 'warn') {
    sendToAxiom(entry)
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
}
