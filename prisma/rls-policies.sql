-- ═══════════════════════════════════════════════
-- ExamOS Row Level Security Policies
-- Run in Supabase SQL Editor once after migrations
-- NEVER disable RLS on user-data tables
-- ═══════════════════════════════════════════════

-- Enable RLS on all user-data tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teacher_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "parent_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "parent_child_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "health_surveys" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "whiteboard_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "whiteboard_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bot_corrections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exam_cutoffs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mock_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subject_scores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "study_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;

---- USERS TABLE ----
-- Students see only their own user row; coordinators see all
CREATE POLICY "users_select_own" ON "users"
  FOR SELECT USING (
    auth.uid()::text = "id"
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "users_update_own" ON "users"
  FOR UPDATE USING (auth.uid()::text = "id")
  WITH CHECK (auth.uid()::text = "id");

CREATE POLICY "users_insert_public" ON "users"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_delete_coordinator" ON "users"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

---- STUDENT PROFILES ----
-- Student sees own, parent sees linked children, coordinator sees all
CREATE POLICY "student_profiles_select_own" ON "student_profiles"
  FOR SELECT USING (
    "userId" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "parent_child_links"
      WHERE "studentId" = "student_profiles"."id"
        AND "parentId" IN (SELECT "id" FROM "parent_profiles" WHERE "userId" = auth.uid()::text)
    )
    OR EXISTS (SELECT 1 FROM "teacher_profiles" tp WHERE tp."userId" = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "student_profiles_insert_own" ON "student_profiles"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "student_profiles_update_own" ON "student_profiles"
  FOR UPDATE USING ("userId" = auth.uid()::text);

---- TEACHER PROFILES ----
CREATE POLICY "teacher_profiles_select_own" ON "teacher_profiles"
  FOR SELECT USING (
    "userId" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "teacher_profiles_update_own" ON "teacher_profiles"
  FOR UPDATE USING ("userId" = auth.uid()::text);

---- PARENT PROFILES ----
CREATE POLICY "parent_profiles_select_own" ON "parent_profiles"
  FOR SELECT USING (
    "userId" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "parent_profiles_update_own" ON "parent_profiles"
  FOR UPDATE USING ("userId" = auth.uid()::text);

---- PARENT_CHILD_LINKS ----
CREATE POLICY "parent_child_links_select" ON "parent_child_links"
  FOR SELECT USING (
    "parentId" IN (SELECT "id" FROM "parent_profiles" WHERE "userId" = auth.uid()::text)
    OR "studentId" IN (SELECT "id" FROM "student_profiles" WHERE "userId" = auth.uid()::text)
  );

---- HEALTH SURVEYS (most sensitive — strictest access) ----
-- Student sees own; coordinator sees all; parents NEVER see health data
CREATE POLICY "health_surveys_select_own" ON "health_surveys"
  FOR SELECT USING (
    "userId" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "health_surveys_insert_own" ON "health_surveys"
  FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

---- WHITEBOARD SESSIONS ----
-- See own hosted sessions or sessions where user is a member
CREATE POLICY "whiteboard_sessions_select_member" ON "whiteboard_sessions"
  FOR SELECT USING (
    "hostId" = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "whiteboard_members"
      WHERE "sessionId" = "whiteboard_sessions"."id" AND "userId" = auth.uid()::text
    )
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "whiteboard_sessions_insert_host" ON "whiteboard_sessions"
  FOR INSERT WITH CHECK ("hostId" = auth.uid()::text);

---- MOCK RESULTS ----
CREATE POLICY "mock_results_select_own" ON "mock_results"
  FOR SELECT USING (
    "studentId" IN (SELECT "id" FROM "student_profiles" WHERE "userId" = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "mock_results_insert_own" ON "mock_results"
  FOR INSERT WITH CHECK (
    "studentId" IN (SELECT "id" FROM "student_profiles" WHERE "userId" = auth.uid()::text)
  );

---- SUBJECT SCORES ----
CREATE POLICY "subject_scores_select_own" ON "subject_scores"
  FOR SELECT USING (
    "studentId" IN (SELECT "id" FROM "student_profiles" WHERE "userId" = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

---- STUDY SESSIONS ----
CREATE POLICY "study_sessions_select_own" ON "study_sessions"
  FOR SELECT USING (
    "studentId" IN (SELECT "id" FROM "student_profiles" WHERE "userId" = auth.uid()::text)
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

---- NOTIFICATIONS ----
CREATE POLICY "notifications_select_own" ON "notifications"
  FOR SELECT USING (
    "userId" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

CREATE POLICY "notifications_update_own" ON "notifications"
  FOR UPDATE USING ("userId" = auth.uid()::text);

---- AUDIT LOGS - coordinator only; user sees own ----
CREATE POLICY "audit_logs_select" ON "audit_logs"
  FOR SELECT USING (
    "userId" = auth.uid()::text
    OR EXISTS (SELECT 1 FROM "users" u WHERE u."id" = auth.uid()::text AND u."role" = 'COORDINATOR')
  );

---- EXAM CUTOFFS (public data — everyone can read) ----
CREATE POLICY "exam_cutoffs_select_public" ON "exam_cutoffs"
  FOR SELECT USING (true);
