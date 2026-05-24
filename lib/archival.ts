// Data Archival Configuration
// Execute via cron/BullMQ weekly

// Retention Periods
export const RETENTION = {
  auditLogs: { hot: 30, warm: 365 },        // days
  healthSurveys: { retain: 730 },             // 2 years
  mockResults: { retain: 1095 },              // 3 years
  whiteboardSessions: { canvas: 90, meta: 365 },
  notifications: { retain: 30 },
} as const

// Partition boundaries (deployed via prisma/partitioning.sql)
export const PARTITION_TABLES = [
  'audit_logs',
  'mock_results',
  'health_surveys',
] as const

// Archival job — call from BullMQ worker
export async function archiveOldRecords() {
  // 1. Audit logs > 30 days → warm storage
  // 2. Health surveys > 2 years → cold storage + anonymize
  // 3. Mock results > 3 years → cold storage
  // 4. Whiteboard canvas > 90 days → compress
  // 5. Notifications > 30 days → purge
  throw new Error('Archival job not yet bound to scheduler')
}
