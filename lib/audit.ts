import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_LOGIN_FAILED'
  | 'SESSION_INVALIDATED'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_DELETED'
  | 'ROLE_CHANGED'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'DATA_EXPORTED'
  | 'DATA_DELETED'
  | 'PROFILE_UPDATED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_CAPTURED'
  | 'PAYMENT_FAILED'
  | 'REFUND_ISSUED'
  | 'CONTENT_PUBLISHED'
  | 'CONTENT_DELETED'
  | 'CONTENT_REPORTED'
  | 'HEALTH_SURVEY_SUBMITTED'
  | 'CRISIS_ALERT_TRIGGERED'
  | 'COUNSELOR_ESCALATED'
  | 'USER_IMPERSONATED'
  | 'BULK_OPERATION'
  | 'SYSTEM_CONFIG_CHANGED'
  | 'FEATURE_FLAG_TOGGLED'

interface AuditEntry {
  userId: string
  action: AuditAction
  entityId?: string
  entityType?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export async function auditLog(entry: AuditEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityId: entry.entityId,
        entityType: entry.entityType,
        metadata: entry.metadata ?? {},
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
      select: { id: true },
    })
  } catch (error) {
    logger.error('audit log write failed', {
      originalAction: entry.action,
      error: String(error),
    })
  }
}
