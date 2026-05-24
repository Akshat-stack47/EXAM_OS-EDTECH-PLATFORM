-- ═══ POSTGRESQL TABLE PARTITIONING (Execute in Supabase SQL Editor) ═══
-- These tables must be partitioned by created_month once rows exceed 1M.

-- 1. Mock Results Partitioning
CREATE TABLE mock_results_partitioned (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    test_id TEXT NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    total_marks DOUBLE PRECISION NOT NULL,
    time_taken_secs INTEGER NOT NULL,
    subject_breakup JSONB NOT NULL,
    percentile DOUBLE PRECISION,
    rank INTEGER,
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
) PARTITION BY RANGE (attempted_at);

-- Example: Creating partitions for May 2026
CREATE TABLE mock_results_y2026m05 PARTITION OF mock_results_partitioned
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

-- 2. Audit Log Partitioning
CREATE TABLE audit_logs_partitioned (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_y2026m05 PARTITION OF audit_logs_partitioned
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
