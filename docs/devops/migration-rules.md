# ExamOS Migration Rules — NEVER Violate

## The 2-Step Column Drop Rule
NEVER drop a column in one migration. Always 2 steps:

### Step 1 (Deploy with old + new code): Make column nullable
```
ALTER TABLE users ALTER COLUMN old_column DROP NOT NULL;
```

### Step 2 (Next deploy, after all instances use new column): Drop it
```
ALTER TABLE users DROP COLUMN old_column;
```

## Forbidden in production migrations:
- DROP COLUMN (use 2-step)
- DROP TABLE (use soft delete + rename)
- TRUNCATE
- Column type change without compatibility check
- Renaming columns without alias period

## Safe migration patterns:
- ADD COLUMN with DEFAULT value
- ADD INDEX CONCURRENTLY (non-blocking)
- CREATE TABLE
- ADD CONSTRAINT with NOT VALID (validate separately)
- Extending enum values (append only)

## Pre-migration checklist:
- [ ] Tested on staging with production data volume
- [ ] Migration is reversible (know the rollback SQL)
- [ ] No LOCK on high-traffic tables
- [ ] Estimated migration time < 30 seconds
- [ ] If > 30 seconds: run during off-peak hours (2-4 AM IST)
