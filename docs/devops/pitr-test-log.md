# PITR Restore Test Log

## How to test (run quarterly)
1. Note current timestamp: `$(date -u +"%Y-%m-%dT%H:%M:%SZ")`
2. Insert a test record: `INSERT INTO pitr_test (note, created_at) VALUES ('test', NOW());`
3. Go to Supabase Dashboard → Backups → Point-in-time Recovery
4. Restore to 2 minutes BEFORE the insert
5. Verify: `SELECT * FROM pitr_test WHERE note = 'test';` → should return 0 rows
6. Restore to 2 minutes AFTER the insert
7. Verify: → should return 1 row
8. Log result below

## Test History
| Date | Tester | Result | Restore Time | Notes |
|------|--------|--------|--------------|-------|
| TODO | TODO   | TODO   | TODO         | First test pending |
