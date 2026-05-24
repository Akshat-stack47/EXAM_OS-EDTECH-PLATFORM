-- scripts/analyze-slow-queries.sql
-- Run in Supabase SQL editor to find slow queries
-- Run BEFORE and AFTER adding indexes

-- Check for sequential scans (bad = missing index)
EXPLAIN ANALYZE
SELECT * FROM mock_results
WHERE student_id = 'cuid_123'
ORDER BY created_at DESC
LIMIT 20;

-- Check leaderboard query
EXPLAIN ANALYZE
SELECT sp.user_id, sp.xp_points, u.name
FROM student_profiles sp
JOIN users u ON u.id = sp.user_id
WHERE sp.deleted_at IS NULL
ORDER BY sp.xp_points DESC
LIMIT 100;

-- Check health survey query
EXPLAIN ANALYZE
SELECT * FROM health_surveys
WHERE user_id = 'cuid_123'
  AND deleted_at IS NULL
ORDER BY week_start DESC
LIMIT 52;

-- WHAT TO LOOK FOR:
-- "Seq Scan" = missing index -> add @@index in schema.prisma
-- "Index Scan" = good
-- Cost > 1000 = investigate
-- Rows estimate very different from actual = run ANALYZE on table

-- Auto-identify tables needing ANALYZE:
SELECT schemaname, tablename, last_analyze, last_autoanalyze
FROM pg_stat_user_tables
WHERE last_analyze IS NULL OR last_analyze < NOW() - INTERVAL '7 days'
ORDER BY n_live_tup DESC;
