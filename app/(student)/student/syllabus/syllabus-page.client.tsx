'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

/* ─── Syllabus data per exam ─────────────────────────────────────── */
const SYLLABUS_BY_EXAM: Record<string, { subject: string; topics: { name: string; pct: number }[] }[]> = {
  UPSC: [
    { subject: 'History',       topics: [{ name: 'Ancient India', pct: 85 }, { name: 'Medieval India', pct: 72 }, { name: 'Modern India', pct: 60 }, { name: 'World History', pct: 45 }] },
    { subject: 'Polity',        topics: [{ name: 'Constitution', pct: 90 }, { name: 'Parliament', pct: 82 }, { name: 'Judiciary', pct: 75 }, { name: 'Local Governance', pct: 55 }] },
    { subject: 'Geography',     topics: [{ name: 'Physical Geography', pct: 65 }, { name: 'Indian Geography', pct: 58 }, { name: 'Economic Geography', pct: 42 }, { name: 'World Geography', pct: 38 }] },
    { subject: 'Economy',       topics: [{ name: 'Macroeconomics', pct: 78 }, { name: 'Indian Economy', pct: 70 }, { name: 'Agriculture', pct: 65 }, { name: 'International Trade', pct: 50 }] },
    { subject: 'Science & Tech',topics: [{ name: 'Physics Basics', pct: 50 }, { name: 'Chemistry Basics', pct: 45 }, { name: 'Biology & Health', pct: 55 }, { name: 'Space & Defence', pct: 35 }] },
    { subject: 'Environment',   topics: [{ name: 'Ecology', pct: 40 }, { name: 'Climate Change', pct: 55 }, { name: 'Biodiversity', pct: 35 }, { name: 'Env. Schemes & Acts', pct: 30 }] },
    { subject: 'Art & Culture', topics: [{ name: 'Architecture', pct: 50 }, { name: 'Dance & Music', pct: 42 }, { name: 'Painting & Sculpture', pct: 38 }, { name: 'Festivals & Fairs', pct: 45 }] },
    { subject: 'Ethics (GS-4)', topics: [{ name: 'Foundations of Ethics', pct: 60 }, { name: 'Attitude & Aptitude', pct: 55 }, { name: 'Case Studies', pct: 40 }, { name: 'Public Service Values', pct: 50 }] },
  ],
  SSC: [
    { subject: 'Reasoning',          topics: [{ name: 'Analogy', pct: 80 }, { name: 'Coding-Decoding', pct: 75 }, { name: 'Series', pct: 70 }, { name: 'Puzzle & Seating', pct: 60 }, { name: 'Blood Relations', pct: 65 }] },
    { subject: 'Quantitative Apt.',  topics: [{ name: 'Number System', pct: 72 }, { name: 'Algebra', pct: 65 }, { name: 'Geometry', pct: 55 }, { name: 'Data Interpretation', pct: 50 }, { name: 'Trigonometry', pct: 45 }] },
    { subject: 'English',            topics: [{ name: 'Reading Comprehension', pct: 78 }, { name: 'Grammar', pct: 70 }, { name: 'Vocabulary', pct: 62 }, { name: 'Fill in the Blanks', pct: 75 }, { name: 'Error Spotting', pct: 65 }] },
    { subject: 'General Awareness',  topics: [{ name: 'Static GK', pct: 60 }, { name: 'Current Affairs', pct: 55 }, { name: 'History GK', pct: 65 }, { name: 'Science GK', pct: 50 }, { name: 'Sports & Awards', pct: 45 }] },
    { subject: 'Computer',           topics: [{ name: 'Basics of Computer', pct: 85 }, { name: 'MS Office', pct: 78 }, { name: 'Internet & Networking', pct: 70 }, { name: 'Shortcut Keys', pct: 72 }] },
  ],
  BANK: [
    { subject: 'Reasoning',          topics: [{ name: 'Puzzle & Seating', pct: 70 }, { name: 'Syllogism', pct: 65 }, { name: 'Coding-Decoding', pct: 75 }, { name: 'Inequalities', pct: 60 }, { name: 'Direction Sense', pct: 68 }] },
    { subject: 'Quantitative Apt.',  topics: [{ name: 'Data Interpretation', pct: 60 }, { name: 'Number Series', pct: 70 }, { name: 'Simplification', pct: 80 }, { name: 'Quadratic Equations', pct: 65 }, { name: 'Time & Work', pct: 55 }] },
    { subject: 'English',            topics: [{ name: 'Reading Comprehension', pct: 72 }, { name: 'Cloze Test', pct: 68 }, { name: 'Para Jumbles', pct: 60 }, { name: 'Error Detection', pct: 65 }, { name: 'Vocabulary', pct: 58 }] },
    { subject: 'Banking Awareness',  topics: [{ name: 'RBI & Monetary Policy', pct: 55 }, { name: 'Banking Terms', pct: 70 }, { name: 'Financial Institutions', pct: 62 }, { name: 'Schemes & Acts', pct: 50 }, { name: 'Budget & Economy', pct: 45 }] },
    { subject: 'Computer',           topics: [{ name: 'Computer Basics', pct: 85 }, { name: 'Networking', pct: 72 }, { name: 'Security & Virus', pct: 68 }, { name: 'Database & DBMS', pct: 60 }] },
    { subject: 'Current Affairs',    topics: [{ name: 'National Affairs', pct: 58 }, { name: 'International Affairs', pct: 50 }, { name: 'Banking News', pct: 62 }, { name: 'Sports & Awards', pct: 45 }] },
  ],
  RAIL: [
    { subject: 'Mathematics',        topics: [{ name: 'Number System', pct: 75 }, { name: 'Percentage & Ratio', pct: 68 }, { name: 'Time & Work', pct: 62 }, { name: 'Geometry', pct: 55 }, { name: 'Mensuration', pct: 50 }] },
    { subject: 'Reasoning',          topics: [{ name: 'Analogy', pct: 78 }, { name: 'Coding-Decoding', pct: 72 }, { name: 'Series', pct: 68 }, { name: 'Classification', pct: 74 }, { name: 'Venn Diagrams', pct: 60 }] },
    { subject: 'General Science',    topics: [{ name: 'Physics', pct: 65 }, { name: 'Chemistry', pct: 60 }, { name: 'Biology', pct: 70 }, { name: 'Environmental Science', pct: 55 }] },
    { subject: 'General Awareness',  topics: [{ name: 'History', pct: 60 }, { name: 'Geography', pct: 58 }, { name: 'Polity', pct: 55 }, { name: 'Economy', pct: 50 }, { name: 'Current Affairs', pct: 48 }] },
    { subject: 'Current Affairs',    topics: [{ name: 'National News', pct: 55 }, { name: 'Railway News', pct: 70 }, { name: 'Sports', pct: 45 }, { name: 'Science & Tech', pct: 50 }] },
  ],
  NDA: [
    { subject: 'Mathematics',        topics: [{ name: 'Algebra', pct: 60 }, { name: 'Calculus', pct: 55 }, { name: 'Trigonometry', pct: 65 }, { name: 'Statistics', pct: 70 }, { name: 'Matrices', pct: 50 }] },
    { subject: 'Physics',            topics: [{ name: 'Mechanics', pct: 70 }, { name: 'Thermodynamics', pct: 62 }, { name: 'Optics', pct: 68 }, { name: 'Electricity', pct: 65 }] },
    { subject: 'Chemistry',          topics: [{ name: 'Physical Chemistry', pct: 65 }, { name: 'Organic Chemistry', pct: 60 }, { name: 'Inorganic Chemistry', pct: 70 }, { name: 'States of Matter', pct: 72 }] },
    { subject: 'History',            topics: [{ name: 'Indian History', pct: 55 }, { name: 'World History', pct: 48 }, { name: 'Freedom Struggle', pct: 62 }, { name: 'Post Independence', pct: 50 }] },
    { subject: 'Geography',          topics: [{ name: 'Physical Geography', pct: 60 }, { name: 'Indian Geography', pct: 65 }, { name: 'World Geography', pct: 50 }, { name: 'Environment', pct: 55 }] },
    { subject: 'English',            topics: [{ name: 'Grammar', pct: 78 }, { name: 'Comprehension', pct: 72 }, { name: 'Vocabulary', pct: 68 }, { name: 'Composition', pct: 65 }] },
  ],
  PSC: [
    { subject: 'History',            topics: [{ name: 'Ancient India', pct: 68 }, { name: 'Medieval India', pct: 65 }, { name: 'Modern India', pct: 72 }, { name: 'State History', pct: 55 }] },
    { subject: 'Polity',             topics: [{ name: 'Constitution', pct: 80 }, { name: 'State Polity', pct: 68 }, { name: 'Local Bodies', pct: 60 }, { name: 'Judiciary', pct: 72 }] },
    { subject: 'Geography',          topics: [{ name: 'Indian Geography', pct: 65 }, { name: 'State Geography', pct: 58 }, { name: 'Physical Geography', pct: 60 }, { name: 'Economic Geography', pct: 50 }] },
    { subject: 'Economy',            topics: [{ name: 'Indian Economy', pct: 62 }, { name: 'State Economy', pct: 55 }, { name: 'Agriculture', pct: 60 }, { name: 'Planning & Development', pct: 50 }] },
    { subject: 'Environment',        topics: [{ name: 'Ecology', pct: 50 }, { name: 'State Wildlife', pct: 58 }, { name: 'Climate Change', pct: 52 }, { name: 'Environmental Acts', pct: 45 }] },
    { subject: 'Current Affairs',    topics: [{ name: 'National Affairs', pct: 60 }, { name: 'State Affairs', pct: 65 }, { name: 'International Affairs', pct: 50 }, { name: 'Sports & Awards', pct: 48 }] },
  ],
  GATE: [
    { subject: 'Data Structures',    topics: [{ name: 'Arrays & Strings', pct: 80 }, { name: 'Linked Lists', pct: 75 }, { name: 'Trees & Graphs', pct: 65 }, { name: 'Hashing', pct: 70 }] },
    { subject: 'Algorithms',         topics: [{ name: 'Sorting & Searching', pct: 72 }, { name: 'Dynamic Programming', pct: 60 }, { name: 'Greedy', pct: 68 }, { name: 'Graph Algorithms', pct: 62 }] },
    { subject: 'Mathematics',        topics: [{ name: 'Linear Algebra', pct: 65 }, { name: 'Probability', pct: 58 }, { name: 'Discrete Maths', pct: 70 }, { name: 'Calculus', pct: 55 }] },
    { subject: 'Operating Systems',  topics: [{ name: 'Process Management', pct: 70 }, { name: 'Memory Management', pct: 65 }, { name: 'File Systems', pct: 72 }, { name: 'Deadlocks', pct: 60 }] },
    { subject: 'Networks',           topics: [{ name: 'OSI & TCP/IP', pct: 75 }, { name: 'Routing Protocols', pct: 65 }, { name: 'Transport Layer', pct: 70 }, { name: 'Network Security', pct: 55 }] },
    { subject: 'DBMS',               topics: [{ name: 'ER Model & SQL', pct: 80 }, { name: 'Normalization', pct: 72 }, { name: 'Transactions', pct: 65 }, { name: 'Indexing', pct: 60 }] },
    { subject: 'Aptitude',           topics: [{ name: 'Quantitative', pct: 78 }, { name: 'Verbal Ability', pct: 70 }, { name: 'Analytical', pct: 75 }] },
  ],
}

const EXAM_ACCENT: Record<string, string> = {
  UPSC: '#7C3AED', SSC: '#06B6D4', BANK: '#22C55E',
  RAIL: '#F59E0B', NDA: '#F97316', PSC: '#E879F9', GATE: '#06B6D4',
}

const col  = (p: number) => p >= 70 ? '#22C55E' : p >= 50 ? '#F59E0B' : '#EF4444'
const bgc  = (p: number) => p >= 70 ? 'rgba(34,197,94,0.1)' : p >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'

export default function SyllabusPageClient() {
  const { data } = trpc.student.getDashboard.useQuery()
  const targetExam = (data?.profile?.targetExam ?? 'UPSC').toUpperCase()

  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)

  const SYLLABUS_DATA = SYLLABUS_BY_EXAM[targetExam] ?? SYLLABUS_BY_EXAM['UPSC']
  const accent = EXAM_ACCENT[targetExam] ?? '#7C3AED'

  const allTopics   = SYLLABUS_DATA.flatMap(s => s.topics)
  const overall     = Math.round(allTopics.reduce((a, t) => a + t.pct, 0) / allTopics.length)
  const strongCount = allTopics.filter(t => t.pct >= 70).length
  const weakCount   = allTopics.filter(t => t.pct < 50).length

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .bar { transition: width 0.9s ease; }
        .subj-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor:pointer; }
        .subj-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.4); }
      `}</style>

      {/* ── Sticky Header ── */}
      <div style={{ background: 'rgba(13,13,26,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', height: 64, gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '1.3rem' }}>📚</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Syllabus Tracker</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: accent }}>
              🎯 {targetExam} — {overall}% covered
            </div>
          </div>
          {/* Quick stats */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.25rem' }}>
            {[
              { label: 'Subjects', val: SYLLABUS_DATA.length, color: accent },
              { label: 'Strong',   val: strongCount,           color: '#22C55E' },
              { label: 'Weak',     val: weakCount,             color: '#EF4444' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>

        {/* ── Overall Progress ── */}
        <div style={{ background: `${accent}12`, border: `1px solid ${accent}28`, borderRadius: 20, padding: '1.75rem', marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Overall Syllabus Coverage</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                {targetExam} · {allTopics.length} total topics · {strongCount} strong · {weakCount} need attention
              </p>
            </div>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: col(overall) }}>{overall}%</span>
          </div>
          <div style={{ height: 14, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
            <div className="bar" style={{ height: '100%', width: `${overall}%`, background: `linear-gradient(90deg,${accent},#06B6D4)`, borderRadius: 100 }} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {[{ c: '#22C55E', l: '≥70% — Strong' }, { c: '#F59E0B', l: '50–69% — Review Needed' }, { c: '#EF4444', l: '<50% — Focus Now' }].map(lx => (
              <div key={lx.l} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: lx.c }} />{lx.l}
              </div>
            ))}
          </div>
        </div>

        {/* ── Subject Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.25rem' }}>
          {SYLLABUS_DATA.map((subject, si) => {
            const avg = Math.round(subject.topics.reduce((a, t) => a + t.pct, 0) / subject.topics.length)
            const isExpanded = expandedSubject === subject.subject
            return (
              <div key={subject.subject}
                className="subj-card"
                onClick={() => setExpandedSubject(isExpanded ? null : subject.subject)}
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isExpanded ? accent + '55' : 'rgba(255,255,255,0.07)'}`, borderRadius: 20, padding: '1.5rem', animation: `fadeUp 0.4s ${si * 0.06}s ease both`, position: 'relative', overflow: 'hidden' }}>

                {/* top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${col(avg)},transparent)` }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{subject.subject}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: col(avg), background: bgc(avg), padding: '0.2rem 0.65rem', borderRadius: 100, border: `1px solid ${col(avg)}33` }}>{avg}%</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Subject progress bar */}
                <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden', marginBottom: isExpanded ? '1.25rem' : 0 }}>
                  <div className="bar" style={{ height: '100%', width: `${avg}%`, background: `linear-gradient(90deg,${col(avg)},${col(avg)}88)`, borderRadius: 100 }} />
                </div>

                {/* Expanded topic list */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeUp 0.25s ease' }}>
                    {subject.topics.map(t => (
                      <div key={t.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{t.name}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: col(t.pct) }}>{t.pct}%</span>
                        </div>
                        <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                          <div className="bar" style={{ height: '100%', width: `${t.pct}%`, background: `linear-gradient(90deg,${col(t.pct)},${col(t.pct)}88)`, borderRadius: 100 }} />
                        </div>
                      </div>
                    ))}
                    <Link href="/student/ai-chat"
                      onClick={e => e.stopPropagation()}
                      style={{ marginTop: '0.5rem', display: 'inline-block', fontSize: '0.72rem', color: '#A78BFA', fontWeight: 700, textDecoration: 'none', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 7, padding: '0.3rem 0.75rem' }}>
                      🧠 Ask AI for Study Plan →
                    </Link>
                  </div>
                )}

                {/* Collapsed summary */}
                {!isExpanded && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{subject.topics.length} topics</span>
                    <span style={{ fontSize: '0.65rem', color: '#22C55E' }}>✓ {subject.topics.filter(t => t.pct >= 70).length} strong</span>
                    {subject.topics.filter(t => t.pct < 50).length > 0 && (
                      <span style={{ fontSize: '0.65rem', color: '#EF4444' }}>⚠ {subject.topics.filter(t => t.pct < 50).length} weak</span>
                    )}
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>Click to expand</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Focus Recommendations ── */}
        {allTopics.filter(t => t.pct < 50).length > 0 && (
          <div style={{ marginTop: '2rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 18, padding: '1.5rem', animation: 'fadeUp 0.5s ease' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 800, color: '#FCA5A5' }}>⚠️ Priority Focus Areas — {targetExam}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SYLLABUS_DATA.flatMap(s => s.topics.filter(t => t.pct < 50).map(t => ({ ...t, subject: s.subject }))).map(t => (
                <div key={t.name} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>{t.subject} · </span>
                  <strong>{t.name}</strong>
                  <span style={{ color: '#EF4444', fontWeight: 800, marginLeft: '0.4rem' }}>{t.pct}%</span>
                </div>
              ))}
            </div>
            <Link href="/student/ai-chat" style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.8rem', color: '#A78BFA', fontWeight: 700, textDecoration: 'none', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 9, padding: '0.5rem 1.1rem' }}>
              🧠 Get AI Study Plan for Weak Topics →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
