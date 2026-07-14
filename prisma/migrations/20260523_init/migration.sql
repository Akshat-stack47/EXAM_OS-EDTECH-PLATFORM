-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'COORDINATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExamCategory" AS ENUM ('UPSC', 'SSC', 'BANKING', 'RAILWAY', 'STATE_PSC', 'JEE', 'NEET', 'DEFENCE');

-- CreateEnum
CREATE TYPE "HealthRisk" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'ENDED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "languagePref" TEXT NOT NULL DEFAULT 'en',
    "avatarUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetExam" "ExamCategory" NOT NULL,
    "targetYear" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "studyHoursGoal" INTEGER NOT NULL DEFAULT 8,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "xpPoints" INTEGER NOT NULL DEFAULT 0,
    "nationalRank" INTEGER,
    "burnoutRisk" "HealthRisk" NOT NULL DEFAULT 'LOW',
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalStudyMins" INTEGER NOT NULL DEFAULT 0,
    "parentLinked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "specialization" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "earnings" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "occupation" TEXT,
    "city" TEXT,
    "alertPrefs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "parent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_child_links" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "parent_child_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_surveys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "moodScore" INTEGER NOT NULL,
    "sleepScore" INTEGER NOT NULL,
    "anxietyScore" INTEGER NOT NULL,
    "motivationScore" INTEGER NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "riskLevel" "HealthRisk" NOT NULL,
    "wantsCounselor" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "aiResponse" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "health_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whiteboard_sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT,
    "hostId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "canvasData" JSONB NOT NULL,
    "maxMembers" INTEGER NOT NULL DEFAULT 6,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "inviteCode" TEXT NOT NULL,
    "botEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiCorrections" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "whiteboard_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whiteboard_members" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "whiteboard_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_corrections" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bot_corrections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_cutoffs" (
    "id" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "examYear" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "general" DOUBLE PRECISION,
    "obc" DOUBLE PRECISION,
    "sc" DOUBLE PRECISION,
    "st" DOUBLE PRECISION,
    "ews" DOUBLE PRECISION,
    "pwd" DOUBLE PRECISION,
    "totalMarks" INTEGER NOT NULL,
    "sourceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "exam_cutoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_results" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "timeTakenSecs" INTEGER NOT NULL,
    "subjectBreakup" JSONB NOT NULL,
    "percentile" DOUBLE PRECISION,
    "rank" INTEGER,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mock_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_scores" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "subject_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_isActive_idx" ON "users"("role", "isActive");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE INDEX "student_profiles_userId_idx" ON "student_profiles"("userId");

-- CreateIndex
CREATE INDEX "student_profiles_targetExam_idx" ON "student_profiles"("targetExam");

-- CreateIndex
CREATE INDEX "student_profiles_burnoutRisk_idx" ON "student_profiles"("burnoutRisk");

-- CreateIndex
CREATE INDEX "student_profiles_xpPoints_idx" ON "student_profiles"("xpPoints");

-- CreateIndex
CREATE INDEX "student_profiles_targetExam_xpPoints_idx" ON "student_profiles"("targetExam", "xpPoints");

-- CreateIndex
CREATE INDEX "student_profiles_lastActiveAt_idx" ON "student_profiles"("lastActiveAt");

-- CreateIndex
CREATE INDEX "student_profiles_nationalRank_idx" ON "student_profiles"("nationalRank");

-- CreateIndex
CREATE INDEX "student_profiles_category_idx" ON "student_profiles"("category");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_userId_key" ON "teacher_profiles"("userId");

-- CreateIndex
CREATE INDEX "teacher_profiles_userId_idx" ON "teacher_profiles"("userId");

-- CreateIndex
CREATE INDEX "teacher_profiles_rating_idx" ON "teacher_profiles"("rating");

-- CreateIndex
CREATE INDEX "teacher_profiles_specialization_idx" ON "teacher_profiles"("specialization");

-- CreateIndex
CREATE UNIQUE INDEX "parent_profiles_userId_key" ON "parent_profiles"("userId");

-- CreateIndex
CREATE INDEX "parent_profiles_userId_idx" ON "parent_profiles"("userId");

-- CreateIndex
CREATE INDEX "parent_profiles_city_idx" ON "parent_profiles"("city");

-- CreateIndex
CREATE INDEX "parent_child_links_parentId_idx" ON "parent_child_links"("parentId");

-- CreateIndex
CREATE INDEX "parent_child_links_studentId_idx" ON "parent_child_links"("studentId");

-- CreateIndex
CREATE INDEX "parent_child_links_isVerified_idx" ON "parent_child_links"("isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "parent_child_links_parentId_studentId_key" ON "parent_child_links"("parentId", "studentId");

-- CreateIndex
CREATE INDEX "health_surveys_userId_idx" ON "health_surveys"("userId");

-- CreateIndex
CREATE INDEX "health_surveys_userId_weekStart_idx" ON "health_surveys"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "health_surveys_riskLevel_idx" ON "health_surveys"("riskLevel");

-- CreateIndex
CREATE INDEX "health_surveys_weekStart_idx" ON "health_surveys"("weekStart");

-- CreateIndex
CREATE INDEX "health_surveys_submittedAt_idx" ON "health_surveys"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "whiteboard_sessions_inviteCode_key" ON "whiteboard_sessions"("inviteCode");

-- CreateIndex
CREATE INDEX "whiteboard_sessions_hostId_idx" ON "whiteboard_sessions"("hostId");

-- CreateIndex
CREATE INDEX "whiteboard_sessions_status_idx" ON "whiteboard_sessions"("status");

-- CreateIndex
CREATE INDEX "whiteboard_sessions_inviteCode_idx" ON "whiteboard_sessions"("inviteCode");

-- CreateIndex
CREATE INDEX "whiteboard_sessions_topic_idx" ON "whiteboard_sessions"("topic");

-- CreateIndex
CREATE INDEX "whiteboard_sessions_createdAt_idx" ON "whiteboard_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "whiteboard_members_sessionId_idx" ON "whiteboard_members"("sessionId");

-- CreateIndex
CREATE INDEX "whiteboard_members_userId_idx" ON "whiteboard_members"("userId");

-- CreateIndex
CREATE INDEX "bot_corrections_sessionId_idx" ON "bot_corrections"("sessionId");

-- CreateIndex
CREATE INDEX "bot_corrections_createdAt_idx" ON "bot_corrections"("createdAt");

-- CreateIndex
CREATE INDEX "exam_cutoffs_examName_idx" ON "exam_cutoffs"("examName");

-- CreateIndex
CREATE INDEX "exam_cutoffs_examYear_idx" ON "exam_cutoffs"("examYear");

-- CreateIndex
CREATE INDEX "exam_cutoffs_stage_idx" ON "exam_cutoffs"("stage");

-- CreateIndex
CREATE INDEX "exam_cutoffs_examName_examYear_idx" ON "exam_cutoffs"("examName", "examYear");

-- CreateIndex
CREATE UNIQUE INDEX "exam_cutoffs_examName_examYear_stage_key" ON "exam_cutoffs"("examName", "examYear", "stage");

-- CreateIndex
CREATE INDEX "mock_results_studentId_idx" ON "mock_results"("studentId");

-- CreateIndex
CREATE INDEX "mock_results_studentId_attemptedAt_idx" ON "mock_results"("studentId", "attemptedAt");

-- CreateIndex
CREATE INDEX "mock_results_testId_idx" ON "mock_results"("testId");

-- CreateIndex
CREATE INDEX "mock_results_attemptedAt_idx" ON "mock_results"("attemptedAt");

-- CreateIndex
CREATE INDEX "mock_results_score_idx" ON "mock_results"("score");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_action_createdAt_idx" ON "audit_logs"("userId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "subject_scores_studentId_idx" ON "subject_scores"("studentId");

-- CreateIndex
CREATE INDEX "subject_scores_subject_idx" ON "subject_scores"("subject");

-- CreateIndex
CREATE INDEX "subject_scores_studentId_subject_idx" ON "subject_scores"("studentId", "subject");

-- CreateIndex
CREATE INDEX "study_sessions_studentId_idx" ON "study_sessions"("studentId");

-- CreateIndex
CREATE INDEX "study_sessions_studentId_createdAt_idx" ON "study_sessions"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "study_sessions_createdAt_idx" ON "study_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_links" ADD CONSTRAINT "parent_child_links_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_links" ADD CONSTRAINT "parent_child_links_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_surveys" ADD CONSTRAINT "health_surveys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whiteboard_sessions" ADD CONSTRAINT "whiteboard_sessions_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whiteboard_members" ADD CONSTRAINT "whiteboard_members_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "whiteboard_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_corrections" ADD CONSTRAINT "bot_corrections_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "whiteboard_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_results" ADD CONSTRAINT "mock_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_scores" ADD CONSTRAINT "subject_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

