# ExamOS — Master Prompt for Claude
## Copy everything from the line below "=== PROMPT START ===" to "=== PROMPT END ==="

---

=== PROMPT START ===

You are acting as a WORLD-CLASS SOFTWARE SYSTEM ARCHITECT, CTO, PRODUCT STRATEGIST, AI INFRASTRUCTURE ENGINEER, and IMPLEMENTATION PLANNER with 20+ years of experience building scalable consumer platforms in emerging markets.

I am building **ExamOS v2.0** — a unified Exam Intelligence Platform for India targeting 200M+ government exam aspirants (UPSC, SSC, Railways, Banking, State PCS, JEE, NEET etc.). I have prepared two product blueprint documents. They are pasted below as DOCUMENT 1 and DOCUMENT 2.

Your task is NOT to summarize them. Your task is to:
- Deeply analyze both documents
- Detect contradictions, missing systems, vague areas, overengineering, unrealistic timelines
- Detect architectural conflicts, frontend/backend disconnects, missing AI pipeline logic
- Detect missing security, DevOps, monitoring, testing, and deployment strategies
- Then produce ONE FINAL MASTER IMPLEMENTATION ROADMAP

Think independently like a senior CTO. Do NOT preserve bad decisions. Do NOT combine documents mechanically.

---

## ═══════════════════════════════════════════
## DOCUMENT 1 — ExamOS Master Blueprint v1.0
## ═══════════════════════════════════════════

### PRODUCT VISION
ExamOS is India's Unified Exam Intelligence Platform. Core insight: The average UPSC aspirant uses 12–18 different apps, websites, and Telegram channels. ExamOS kills this fragmentation by being the single ecosystem for every exam workflow.

**Target Market:** 200M+ government exam aspirants | ₹60,000 Crore EdTech market (2026)

**Core Value Proposition:** One ecosystem. Every exam. Zero fragmentation.

---

### 11 DEEPLY INTEGRATED MODULES

1. **Exam Intelligence Hub** (CORE) — Eligibility engine, Smart exam calendar, Syllabus intelligence, attempt limits, reservation criteria, topic-to-PYQ frequency mapping, heatmap
2. **Study System** (CONTENT) — Notes, PYQs, mock tests, flashcards, crux notes, one-night revision, formula sheets
3. **AI Intelligence Engine** (AI) — Weak topic detection (3-signal model), adaptive learning, AI mentor, personalized strategy, burnout detection, score prediction (XGBoost)
4. **Auto Form Filler** (UTILITY) — One-time data vault → auto-detect forms → check eligibility → auto-fill → remind → admit cards. Document types: Aadhaar, PAN, photo, signature, caste certificate, income certificate, bank details. OCR via AWS Textract.
5. **Current Affairs Engine** (MEDIA) — AI news aggregation from The Hindu, PIB, IE. Fake news firewall (ML-based source credibility). AI-generated exam-ready notes. Daily 10-minute audio brief.
6. **Teacher Marketplace** (MARKETPLACE) — Verified profiles, demo classes, escrow payments, hourly/monthly hire, AI fraud detection, reputation engine, live doubt solving, Agora video.
7. **Community System** (SOCIAL) — Study rooms, Pomodoro co-study, study wars, accountability partners, XP/streak systems, shareable rank cards (viral WhatsApp/Instagram).
8. **Productivity OS** (PRODUCTIVITY) — Goal tracker, daily targets, smart reminders, AI scheduling, Pomodoro timer.
9. **Trust & Safety Layer** (TRUST) — Fake notes detection, scam alerts, copyright checking, malware PDF scanning, AI moderation.
10. **Analytics Dashboard** (ANALYTICS) — Weak topic heatmap, time allocation analysis, mock test trajectory, percentile tracking, rank prediction.
11. **Career OS** (CAREER) — Post-selection guidance, document tracker, interview prep, AI interview trainer, posting updates.

---

### DATA FLOW (Module Interconnections)
```
Exam Selection → Syllabus Graph → AI Study Plan → Mock Test → Weak Topic Map → AI Re-schedule
Current Affairs Engine → Study Notes → AI Quiz Generator → Mock Test → Analytics
Form Filler → Exam Calendar → Smart Reminders → Community Challenge Board
Teacher Marketplace → Live Sessions → Doubt Tagging → Weak Topic Resolution
```
All modules share data through a **Central Student Profile Graph**.

---

### COMPETITOR ANALYSIS (Key Gaps ExamOS Exploits)
| Platform | Critical Weakness | ExamOS Advantage |
|---|---|---|
| Unacademy | No personalization, bloated | AI-matched teachers + quality-gated marketplace |
| Physics Wallah | No AI, no community depth | AI-adaptive content + community gamification |
| Adda247 | Poor UX, dark patterns | Clean UX + no dark patterns + AI-powered PYQ analysis |
| Testbook | Only tests, no ecosystem | Integrated: test → weak areas → notes → retest |
| Drishti IAS | No tech layer, static content | Hindi-first AI + vernacular voice + mobile-native |
| Telegram | Zero curation, fake PDFs | Verified content + structured rooms |

---

### TECH STACK (v1 Blueprint)
- **Frontend:** React Native (mobile), Next.js 14 (web), TailwindCSS, Zustand, React Query, Expo
- **Backend:** Node.js/Express (API Gateway), FastAPI (AI services), Go (high-throughput), GraphQL, gRPC
- **Databases:** PostgreSQL (primary), MongoDB (content), Redis (cache), Elasticsearch (search), Pinecone (vector), ClickHouse (analytics)
- **AI Stack:** Claude API (mentor), GPT-4o (fallback), Sarvam AI (Hindi TTS/STT), Whisper, LangChain, LlamaIndex, scikit-learn, PyTorch
- **Infra:** AWS (Mumbai region), Kubernetes, CloudFront CDN, S3, SQS/SNS, Terraform, GitHub Actions, Datadog
- **Real-time:** Socket.io, Firebase Realtime, Agora (video), FCM/APNs, Twilio SMS
- **OCR/Docs:** AWS Textract, Tesseract (fallback), PyMuPDF, Sharp

---

### DATABASE SCHEMA (v1)
```
users { id UUID PK, phone VARCHAR UNIQUE, name, dob, category, exam_goals JSONB, subscription_tier ENUM(free/aspirant/pro/elite), xp_points, streak_days, level, onboarding_completed_at }

student_profiles { user_id FK, weak_topics JSONB, strong_topics JSONB, ai_memory_context TEXT, predicted_score JSONB, burnout_risk_score FLOAT, study_hours_today INT }

mock_tests + test_attempts + question_responses { topic_id FK → topics, difficulty ENUM, pyq_year INT NULL, time_taken, is_correct, confidence_rating }

document_vault { user_id FK, doc_type ENUM(aadhaar/pan/photo/signature/certificate), s3_key VARCHAR, extracted_fields JSONB, encryption_key_id VARCHAR (AWS KMS) }

teachers + teacher_reviews + sessions { verification_status ENUM(pending/verified/suspended), ai_fraud_score FLOAT, student_success_rate FLOAT, session.payment_status ENUM(escrow/released/disputed) }
```

---

### MICROSERVICES (v1 Architecture)
auth-service | exam-service | content-service | test-service | ai-tutor-service | analytics-service | news-service | form-service | marketplace-service | community-service | notification-service | payment-service | trust-service | search-service | cdn-service

---

### AI SYSTEM DESIGN
- **RAG Pipeline:** Syllabus + PYQs + notes chunked → embedded (text-embedding-3-large) → Pinecone → retrieval → Claude API synthesis. Prevents hallucination. Cohere Rerank API for quality.
- **Student Memory System:** Persistent memory graph per student (topics studied, accuracy, time patterns, mood signals, goal progression). Referenced in every AI interaction.
- **Weak Topic Detection:** 3-signal model: (1) Time-to-answer vs baseline, (2) Accuracy on topic cluster over rolling 14-day window, (3) Confidence rating post-answer. "Critical weak" when all 3 signals negative for 3+ sessions.
- **Score Prediction:** XGBoost trained on historical mock trajectories of exam qualifiers. Inputs: mock scores (trend), revision hours, topic coverage %, exam proximity, category.
- **Hindi/Hinglish AI:** Claude API + Sarvam AI TTS. Code-switching handled natively.
- **Fine-tuning Plan:** Phase 1 RAG-only → Phase 2 fine-tune Mistral 7B on Indian exam corpus, hosted on AWS SageMaker.

---

### MONETIZATION
- Free: 3 exams, 10 mocks/month, basic CA, community, 1 AI Q/day
- Aspirant ₹199/mo: Unlimited mocks, full PYQ, AI weak topic detection
- Pro ₹499/mo: Full AI mentor, score prediction, form filler, study plan, AI interview trainer
- Elite ₹999/mo: Everything + 1 teacher session/month + dedicated success manager
- Teacher commission: 15–20% of earnings
- B2B SaaS for coaching institutes: ₹25K–1L/month
- Affiliate (books, stationery), anonymized data insights (DPDP-compliant)

---

### ROADMAP (v1 Phases)
- Phase 1 (Months 1–4): Auth + Exam Hub + Study System + Mock Engine (100 exams) + basic AI
- Phase 2 (Months 5–8): AI mentor (RAG) + Current Affairs Engine + Teacher Marketplace + Subscriptions
- Phase 3 (Months 9–16): Auto Form Filler + Community/Gamification + Score Prediction + Mobile App
- Phase 4 (Months 17–30): B2B SaaS + Government partnerships + Offline rural expansion + Voice-first
- Phase 5 (Months 30+): Career OS + Parent Dashboard + VR classrooms + Unicorn pathway

---

### KILL RISKS (Critical Warnings)
1. Building Too Much Too Fast — scope discipline is existential
2. Fake Content Spiral — one wrong answer tweet = mass uninstall
3. AI Hallucination on Exam Facts — wrong Article 370 date destroys someone's UPSC answer
4. Teacher Quality Collapse — even 10% bad actors kills marketplace
5. Data Breach — Aadhaar + caste certificate data, DPDP Act 2023 criminal liability
6. Predatory Monetization — BYJU's proof that this destroys companies
7. Tech Debt During Hypergrowth — exam notification = 20–50x traffic spike in 24 hours
8. Content Scraping Legal Risk — scraping UPSC/SSC portals may violate ToS
9. Community Moderation Failure — one bad decision can cause community exodus
10. Mental Health Neglect — students in crisis reaching out to AI tutor must have escalation path

---

## ═══════════════════════════════════════════
## DOCUMENT 2 — ExamOS Blueprint v2.0 Enhanced
## ═══════════════════════════════════════════

### KEY ADDITIONS OVER v1

**4 Role-Based Dashboards (Different UX for Each User Type):**

#### 1. Parent Dashboard (Warm Saffron Palette)
- Audience: Parents 35–60 yrs, semi-tech-savvy, emotionally invested
- Color: #E8722A Saffron Orange + warm cream backgrounds (#FFF8F2)
- Font: Nunito 16–17px (rounded, accessible for older eyes)
- Features: Child progress visibility, exam deadlines, fee management, AI assistant in Hindi
- UX: No dark patterns. Bilingual toggle (English/हिंदी) always visible. FAB: "💬 AI Se Puchein"
- Alerts system: color-coded (orange = warning, green = good, blue = info)
- Child toggle (parent can monitor multiple children)

#### 2. Aspirant Dashboard (Dark Premium Palette — "Gaming OS")
- Audience: Students 18–30 yrs, digitally native, competitive
- Color: Deep purple #7C3AED + cyan #06B6D4
- Font: Poppins — trendy, high info density
- Inspired by: Linear, Arc Browser, Discord
- Features: Weakness Radar (AI radar chart 8 subjects), Gamification Layer (XP, daily missions, boss mode at 30-day streak), Pomodoro timer (25/5 or 50/10), AI Score Predictor, National rank tracker
- Layout: Stats row (last mock score, syllabus %, study hours, national rank) + AI mentor chat inline

#### 3. Teacher Dashboard (Professional Navy Blue)
- Audience: Teachers 28–50 yrs, professional, focused on outcomes
- Color: Navy #1E40AF + sky blue #0EA5E9
- Font: Poppins 16px base
- Features: AI Burnout Detector (flags students at 70%+ burnout risk), Class Performance Heatmap, AI-Graded Assignments (reduces grading by 70%), Revenue Dashboard (payout, tax summary, commission breakdown)
- At-risk student alerts: HIGH/MEDIUM/LOW risk badges with actionable notifications

#### 4. Coordinator Dashboard (Operational Terminal Dark)
- Audience: Platform admins, content moderators, ops team
- Color: Dark terminal #0F1117 + electric cyan #00D2FF
- Font: IBM Plex Mono
- Features: Service Health Monitor (real-time latency/error rate table), Content Moderation Queue, User Management Console (impersonation mode, bulk ops, GDPR export), Anti-Fraud Monitor (AI pattern detection), Revenue Analytics (MRR/ARR/churn/LTV, GST-compliant export), Broadcast & Announcement system

---

### COLLABORATIVE WHITEBOARD (New in v2)
- Figma-meets-Miro experience for exam preparation
- Features: Freehand drawing, sticky notes, mind maps, diagram templates, voice chat, session replay, export to PDF
- **ExamBot AI Error Engine:** Real-time OCR monitoring of whiteboard text → checks facts against knowledge base → flags errors within 2 seconds → classifies: Factual Error / Conceptual Confusion / Incomplete / Correct but Imprecise
- Adaptive quizzing: every 10 minutes, ExamBot generates 3 questions based on what group discussed → simultaneous answer → instant comparison
- Session Analytics: post-session data feeds into individual student profiles

---

### AI HEALTH & WELLNESS ENGINE (New in v2)
- **Weekend Mental Health Survey:** Every Saturday 6 PM, 5-minute check-in (cannot skip, can defer 2h). Questions in Hindi: sleep quality, study motivation, anxiety level, personal stress.
- **AI Response to Survey:** Score 1–2 → immediate counselor message + helpline | Declining 3 weeks → professional counselor auto-connect | Crisis keywords → emergency protocol (iCall + Vandrevala Foundation)
- **ExamFit Bot:** Every 90 minutes, 2-minute exercise break (eye rotation, neck stretch, breathing, back relief, wrist stretch, mental reset)
- **AI Diet Planner:** Budget-aware (₹50–500/day), region-specific Indian food, brain-boosting foods
- **AI Timetable Generator:** Based on exam date, weak subjects, sleep pattern, work schedule
- **Sleep Optimization:** Tracks session end times, wind-down mode 30 min before bedtime
- **Crisis Support:** Suicidal ideation keywords → 24/7 human counselor, parent alert with consent

---

### ENHANCED DATABASE ARCHITECTURE (v2 Additions)
- **Supabase RLS (Row Level Security)** combined with Prisma ORM as primary DB strategy
- Multi-tenant architecture for 4 dashboard types
- Real-time subscriptions via Supabase Realtime for live dashboards
- Separate color palettes and font tokens stored in DB per role type

---

### ELIGIBILITY ENGINE v2 (Enhanced)
- Past year cutoffs integrated: last 5 years, category-wise (General/OBC/SC/ST/EWS/PwD)
- "Am I Ready?" AI scoring vs historical cutoffs
- Real-time eligibility verdict when student inputs DOB, category, qualifications

---

### WHITEBOARD TECHNICAL REQUIREMENTS
- WebSocket real-time sync for collaborative drawing
- OCR pipeline for ExamBot error detection
- Session recording and replay
- Integration with student analytics (whiteboard activity → student profile)

---

## ═══════════════════════════════════════════
## YOUR 10-STEP ANALYSIS AND OUTPUT TASK
## ═══════════════════════════════════════════

Now that you have read both documents completely, execute the following 10 steps in order:

---

### STEP 1 — PROJECT UNDERSTANDING SUMMARY

Before anything else, write:
- What exact problem this product solves (in 5 sentences max)
- The core user journey from Day 1 to Month 12 (for a student)
- What the realistic MVP should contain (what delivers the MINIMUM value to keep users)
- What is critical vs optional vs post-MVP
- What is the single biggest architectural challenge in this product

---

### STEP 2 — DOCUMENT ANALYSIS

Analyze both documents comparatively. Create these sections:

**A. Common Ideas (both docs agree on)**
**B. Conflicting Ideas (docs contradict each other)**
**C. Missing Components (not mentioned in either doc)**
**D. Unrealistic Components (for an early-stage team)**
**E. Overcomplicated Architecture Areas**
**F. Weakly Defined Modules**
**G. Missing Implementation Details**
**H. Missing Scalability Considerations**
**I. Missing Frontend/Backend Integration Details**
**J. Missing Security/Auth/Data Validation**
**K. Missing Observability/Logging/Testing**
**L. Missing CI-CD/DevOps Strategy**
**M. Missing AI Orchestration / Inference Flow**

Then explicitly state:
- Which ideas to KEEP
- Which to REMOVE
- Which to REDESIGN
- Which to POSTPONE after MVP

---

### STEP 3 — FINAL SYSTEM ARCHITECTURE

Generate a FINAL PRODUCTION-GRADE ARCHITECTURE covering:

1. High-Level System Design (ASCII diagram)
2. Backend Architecture (Modular Monolith vs Microservices decision with justification)
3. Frontend Architecture (Next.js + React Native structure)
4. AI/ML Pipeline Architecture (RAG flow + inference + memory)
5. API Gateway Design
6. Database Architecture (Supabase RLS + Prisma schema strategy)
7. Authentication & Authorization (Supabase Auth + JWT + RLS)
8. Queue/Event System
9. Real-time Communication Layer (WebSockets for whiteboard + leaderboards)
10. File/Blob Storage Strategy (documents vault + media)
11. Caching Strategy (Redis layers)
12. Search Architecture
13. Agent/Workflow Architecture (AI mentor memory + RAG orchestration)
14. Microservices vs Modular Monolith — final decision
15. Infrastructure Design (AWS Mumbai)
16. Deployment Architecture
17. Scaling Strategy (handle 1M concurrent during exam notifications)
18. Security Architecture (Aadhaar vault, DPDP Act 2023, PII handling)
19. Monitoring & Logging (what to monitor, what tools)
20. Testing Architecture (unit, integration, load, AI quality)
21. CI/CD Architecture
22. Cost Optimization Strategy (startup budget-aware)
23. Disaster Recovery Strategy
24. Environment Separation (dev/staging/prod)
25. Configuration Management

For every decision: explain WHY it is better than the alternative.

---

### STEP 4 — FINAL MASTER IMPLEMENTATION ROADMAP

Create a phase-wise roadmap. For EACH phase include:

- **Objective** (what problem does this phase solve)
- **Features** (exact list, no vague items)
- **Backend Tasks** (specific APIs, services to build)
- **Frontend Tasks** (specific screens/components)
- **Database Tasks** (exact Prisma models to create)
- **API Tasks** (endpoint contracts)
- **AI Tasks** (what AI pipeline to build)
- **Infrastructure Tasks** (what cloud resources to provision)
- **DevOps Tasks** (CI/CD, monitoring setup)
- **Security Tasks** (specific security implementations)
- **Testing Tasks** (what to test and how)
- **Deliverables** (what is demo-able at end of phase)
- **Dependencies** (what MUST be done before this phase)
- **Risks** (top 3 risks for this phase)
- **Success Criteria** (measurable KPIs to consider phase complete)

**IMPORTANT CONSTRAINTS:**
- Phase 1 must be achievable by a team of 4–6 engineers in 8–12 weeks
- Supabase RLS + Prisma is the database strategy
- Aspirant Dashboard (Mock Tests + Analytics + Auth) is Phase 1 priority
- Do NOT include Teacher Marketplace, Whiteboard, or Health Engine in Phase 1

---

### STEP 5 — EXACT DEVELOPMENT ORDER

List the exact build sequence with dependency mapping:

```
Phase 0 (Week 1-2): Foundation
- [ ] Monorepo setup (Turborepo)
- [ ] ...

Phase 1 (Week 3-8): Core
- [ ] Supabase project + auth setup
- [ ] ...
```

Mention explicitly:
- What MUST be built first
- What can run in parallel
- What should be delayed
- What should NEVER be built in MVP

---

### STEP 6 — TEAM STRUCTURE

Suggest:
- Required roles and hiring priority (P0/P1/P2)
- Which roles are critical for Phase 1
- Which work can be done by 1 person
- Which tasks need specialists (AI engineer, DevOps, etc.)
- Team size per phase

---

### STEP 7 — TECH STACK FINALIZATION

For each layer provide a table:
| Layer | Recommended | Why | Alternative | Tradeoff |

Cover: Frontend web, Frontend mobile, Backend API, Database, Cache, File storage, AI/LLM, Vector DB, Queue, WebSocket, Search, Deployment, Observability, Analytics, Testing, CI/CD

Flag where the original blueprints made WRONG technology choices and why.

---

### STEP 8 — OUTPUT FORMAT

Use full markdown with:
- `#` headings, `##` subheadings, `###` sub-subheadings
- Tables for comparisons
- Bullet lists for feature sets
- ASCII architecture diagrams where helpful
- ⚠️ Warning banners for high-risk decisions
- ✅ Checkmarks for confirmed good decisions
- 🔴 Red flags for dangerous architectural choices
- Priority labels: `[P0-CRITICAL]` `[P1-HIGH]` `[P2-MEDIUM]` `[P3-LOW]`

---

### STEP 9 — EXECUTION RULES

Think as:
- Startup CTO (speed matters, cost matters)
- Systems Architect (correctness matters, scalability matters)
- Senior Engineering Manager (team productivity matters)
- DevOps Architect (deployment reliability matters)
- Product Execution Strategist (user value delivery matters)

Avoid:
- Vague advice
- Generic recommendations without implementation detail
- Enterprise overengineering for a startup
- Theoretical explanations without action items

---

### STEP 10 — FINAL SUMMARY OUTPUT

End with these 10 sections:

1. **FINAL RECOMMENDED ARCHITECTURE** (3 sentences)
2. **FINAL MVP SCOPE** (exact feature list, nothing more)
3. **FINAL IMPLEMENTATION ROADMAP** (phase names + durations)
4. **FINAL DEVELOPMENT ORDER** (first 20 tasks in exact sequence)
5. **FINAL TECH STACK** (one table)
6. **TOP 10 RISKS** (with mitigation for each)
7. **TOP 10 CRITICAL SUCCESS FACTORS**
8. **WHAT TO BUILD NOW vs LATER** (two columns)
9. **ESTIMATED EXECUTION COMPLEXITY** (per module, Low/Medium/High/Extreme)
10. **ESTIMATED SCALING BOTTLENECKS** (where will system break first at 100K / 1M / 10M users)

---

Begin your analysis now. Take your time. Be extremely detailed and specific. This is an Engineering Bible, not a summary.

=== PROMPT END ===

---

## HOW TO USE THIS PROMPT

1. Copy everything between `=== PROMPT START ===` and `=== PROMPT END ===`
2. Paste it into Claude (claude.ai) — use **Claude Sonnet** or **Claude Opus** for best results
3. Make sure you are in a **new, empty conversation** (no previous context)
4. Let Claude finish completely — it will be a long response (5,000–15,000 words)
5. Save Claude's output as `examos_master_roadmap.md` in your `implementation/` folder
6. Bring that output back here and we will start Phase 0 coding immediately

---

## WHAT THIS PROMPT WILL GENERATE

| Section | Content |
|---|---|
| Step 1 | Project Understanding (honest assessment) |
| Step 2 | Document Analysis (what's good, bad, missing) |
| Step 3 | Final System Architecture (25 layers) |
| Step 4 | Phase-wise Roadmap (Phase 0 → Phase 4) |
| Step 5 | Exact Dev Order (first 50 tasks sequenced) |
| Step 6 | Team Structure (who to hire first) |
| Step 7 | Tech Stack Finalization (corrected stack) |
| Step 8 | Formatted beautifully with warnings |
| Step 9 | Execution-focused, no fluff |
| Step 10 | Final Summary (10 decision tables) |

---

*This prompt embeds the full context of both ExamOS blueprint documents so Claude has everything it needs without you having to upload files.*
