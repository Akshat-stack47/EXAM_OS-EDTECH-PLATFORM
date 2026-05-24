# Audit Log Archival Policy
- Keep online: 12 months (in partitioned table)
- Archive to cold storage: older than 12 months
- Cold storage: Supabase Storage bucket 'audit-archives' (private)
- Never delete audit logs — PDPB 2023 requirement
- Run archival script: `pnpm tsx scripts/archive-audit-logs.ts` (monthly, 1st of month)
