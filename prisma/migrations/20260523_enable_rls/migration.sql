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

-- Users: can view own profile; coordinators can view all
CREATE POLICY "users_self_select" ON "users" FOR SELECT
  USING (id = current_setting('app.current_user_id', TRUE)::TEXT
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "users_self_update" ON "users" FOR UPDATE
  USING (id = current_setting('app.current_user_id', TRUE)::TEXT)
  WITH CHECK (id = current_setting('app.current_user_id', TRUE)::TEXT);

CREATE POLICY "users_self_insert" ON "users" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "users_admin_delete" ON "users" FOR DELETE
  USING (current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

-- Student profiles: student sees own, parent sees linked children, coordinator sees all
CREATE POLICY "student_profiles_select" ON "student_profiles" FOR SELECT
  USING (
    "userId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR EXISTS (
      SELECT 1 FROM "parent_child_links"
      WHERE "studentId" = "student_profiles"."id"
        AND "parentId" IN (
          SELECT "id" FROM "parent_profiles" WHERE "userId" = current_setting('app.current_user_id', TRUE)::TEXT
        )
    )
    OR EXISTS (
      SELECT 1 FROM "teacher_profiles" WHERE "userId" = current_setting('app.current_user_id', TRUE)::TEXT
    )
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR'
  );

CREATE POLICY "student_profiles_insert" ON "student_profiles" FOR INSERT
  WITH CHECK ("userId" = current_setting('app.current_user_id', TRUE)::TEXT);

CREATE POLICY "student_profiles_update" ON "student_profiles" FOR UPDATE
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT);

-- Teacher profiles: teacher sees own, coordinator sees all
CREATE POLICY "teacher_profiles_select" ON "teacher_profiles" FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "teacher_profiles_update" ON "teacher_profiles" FOR UPDATE
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT);

-- Parent profiles: parent sees own, coordinator sees all
CREATE POLICY "parent_profiles_select" ON "parent_profiles" FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "parent_profiles_update" ON "parent_profiles" FOR UPDATE
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT);

-- Health surveys: student sees own, coordinator sees all
CREATE POLICY "health_surveys_select" ON "health_surveys" FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "health_surveys_insert" ON "health_surveys" FOR INSERT
  WITH CHECK ("userId" = current_setting('app.current_user_id', TRUE)::TEXT);

-- Whiteboards: see own sessions + sessions where member
CREATE POLICY "whiteboard_sessions_select" ON "whiteboard_sessions" FOR SELECT
  USING ("hostId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR EXISTS (
      SELECT 1 FROM "whiteboard_members"
      WHERE "sessionId" = "whiteboard_sessions"."id"
        AND "userId" = current_setting('app.current_user_id', TRUE)::TEXT
    )
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "whiteboard_sessions_insert" ON "whiteboard_sessions" FOR INSERT
  WITH CHECK ("hostId" = current_setting('app.current_user_id', TRUE)::TEXT);

-- Mock results: student sees own, coordinator sees all
CREATE POLICY "mock_results_select" ON "mock_results" FOR SELECT
  USING ("studentId" IN (
    SELECT "id" FROM "student_profiles" WHERE "userId" = current_setting('app.current_user_id', TRUE)::TEXT
  ) OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "mock_results_insert" ON "mock_results" FOR INSERT
  WITH CHECK ("studentId" IN (
    SELECT "id" FROM "student_profiles" WHERE "userId" = current_setting('app.current_user_id', TRUE)::TEXT
  ));

-- Subject scores: student sees own, coordinator sees all
CREATE POLICY "subject_scores_select" ON "subject_scores" FOR SELECT
  USING ("studentId" IN (
    SELECT "id" FROM "student_profiles" WHERE "userId" = current_setting('app.current_user_id', TRUE)::TEXT
  ) OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

-- Study sessions: student sees own, coordinator sees all
CREATE POLICY "study_sessions_select" ON "study_sessions" FOR SELECT
  USING ("studentId" IN (
    SELECT "id" FROM "student_profiles" WHERE "userId" = current_setting('app.current_user_id', TRUE)::TEXT
  ) OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

-- Notifications: user sees own, coordinator sees all
CREATE POLICY "notifications_select" ON "notifications" FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');

CREATE POLICY "notifications_update" ON "notifications" FOR UPDATE
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT);

-- Audit logs: coordinator sees all, user sees own
CREATE POLICY "audit_logs_select" ON "audit_logs" FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE)::TEXT
    OR current_setting('app.current_user_role', TRUE) = 'COORDINATOR');
