'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

/* ─── Exam-aware data maps ────────────────────────────────────────── */

const FREE_TESTS_BY_EXAM: Record<string, any[]> = {
  UPSC: [
    { id:'f1', title:'UPSC Prelims GS-1 Full Mock', questions:100, duration:120, difficulty:'Medium', attempts:14820, tag:'UPSC', rating:4.8 },
    { id:'f2', title:'UPSC GS Paper-2 (CSAT) Mock', questions:80,  duration:120, difficulty:'Easy',   attempts:9430,  tag:'UPSC', rating:4.6 },
    { id:'f3', title:'Polity & Governance Special',  questions:60,  duration:60,  difficulty:'Medium', attempts:7620,  tag:'UPSC', rating:4.7 },
    { id:'f4', title:'History – Ancient & Medieval',  questions:50,  duration:45,  difficulty:'Hard',   attempts:5800,  tag:'UPSC', rating:4.8 },
    { id:'f5', title:'Geography Full Set',            questions:60,  duration:60,  difficulty:'Medium', attempts:6200,  tag:'UPSC', rating:4.6 },
    { id:'f6', title:'Current Affairs Jan–Jun 2026',  questions:60,  duration:45,  difficulty:'Hard',   attempts:7890,  tag:'CA',   rating:4.9 },
  ],
  SSC: [
    { id:'f1', title:'SSC CGL Tier-1 Full Mock',        questions:100, duration:60,  difficulty:'Medium', attempts:22100, tag:'SSC',  rating:4.7 },
    { id:'f2', title:'SSC CHSL Tier-1 Practice Set',    questions:100, duration:60,  difficulty:'Easy',   attempts:15400, tag:'SSC',  rating:4.6 },
    { id:'f3', title:'Reasoning – SSC Special',         questions:50,  duration:30,  difficulty:'Medium', attempts:18900, tag:'SSC',  rating:4.8 },
    { id:'f4', title:'Quantitative Aptitude Sectional', questions:25,  duration:15,  difficulty:'Medium', attempts:21000, tag:'SSC',  rating:4.7 },
    { id:'f5', title:'English Language & Comprehension',questions:50,  duration:30,  difficulty:'Easy',   attempts:13500, tag:'SSC',  rating:4.5 },
    { id:'f6', title:'General Awareness Mega Test',     questions:50,  duration:30,  difficulty:'Hard',   attempts:9200,  tag:'SSC',  rating:4.8 },
  ],
  BANK: [
    { id:'f1', title:'IBPS PO Prelims Full Mock',        questions:100, duration:60,  difficulty:'Medium', attempts:18560, tag:'BANK', rating:4.7 },
    { id:'f2', title:'SBI PO Prelims Practice Set',      questions:100, duration:60,  difficulty:'Hard',   attempts:14200, tag:'BANK', rating:4.8 },
    { id:'f3', title:'IBPS Clerk Prelims Mock',          questions:100, duration:60,  difficulty:'Easy',   attempts:16800, tag:'BANK', rating:4.5 },
    { id:'f4', title:'Banking Awareness Sectional',      questions:40,  duration:25,  difficulty:'Medium', attempts:11200, tag:'BANK', rating:4.7 },
    { id:'f5', title:'Reasoning – Banking Special',      questions:35,  duration:20,  difficulty:'Medium', attempts:13400, tag:'BANK', rating:4.6 },
    { id:'f6', title:'Quantitative Aptitude – DI Focus', questions:30,  duration:20,  difficulty:'Hard',   attempts:8900,  tag:'BANK', rating:4.8 },
  ],
  RAIL: [
    { id:'f1', title:'RRB NTPC Full Mock Test',          questions:100, duration:90,  difficulty:'Medium', attempts:31200, tag:'RAIL', rating:4.6 },
    { id:'f2', title:'RRB Group D General Science',      questions:75,  duration:90,  difficulty:'Easy',   attempts:27400, tag:'RAIL', rating:4.5 },
    { id:'f3', title:'RRB ALP Stage-1 Practice Set',     questions:75,  duration:60,  difficulty:'Medium', attempts:18900, tag:'RAIL', rating:4.7 },
    { id:'f4', title:'General Awareness – Railway Focus',questions:50,  duration:30,  difficulty:'Medium', attempts:22100, tag:'RAIL', rating:4.6 },
    { id:'f5', title:'Mathematics Shortcut Practice',    questions:30,  duration:30,  difficulty:'Easy',   attempts:15600, tag:'RAIL', rating:4.5 },
    { id:'f6', title:'Reasoning – Railway Special',      questions:30,  duration:25,  difficulty:'Medium', attempts:14200, tag:'RAIL', rating:4.7 },
  ],
  NDA: [
    { id:'f1', title:'NDA Paper-1 (Mathematics) Full',  questions:120, duration:150, difficulty:'Hard',   attempts:8900,  tag:'NDA',  rating:4.8 },
    { id:'f2', title:'NDA Paper-2 GAT Full Mock',        questions:150, duration:150, difficulty:'Medium', attempts:7600,  tag:'NDA',  rating:4.7 },
    { id:'f3', title:'NDA Physics Special',              questions:40,  duration:40,  difficulty:'Hard',   attempts:5200,  tag:'NDA',  rating:4.8 },
    { id:'f4', title:'NDA Mathematics – Calculus Set',   questions:30,  duration:35,  difficulty:'Hard',   attempts:4800,  tag:'NDA',  rating:4.7 },
    { id:'f5', title:'NDA English & GK Practice',        questions:50,  duration:45,  difficulty:'Easy',   attempts:6100,  tag:'NDA',  rating:4.5 },
    { id:'f6', title:'NDA Current Affairs 2026',         questions:40,  duration:30,  difficulty:'Medium', attempts:4200,  tag:'NDA',  rating:4.6 },
  ],
  PSC: [
    { id:'f1', title:'State PSC GS Prelims Full Mock',   questions:100, duration:120, difficulty:'Medium', attempts:9800,  tag:'PSC',  rating:4.6 },
    { id:'f2', title:'PSC History & Culture Special',    questions:50,  duration:50,  difficulty:'Medium', attempts:6200,  tag:'PSC',  rating:4.7 },
    { id:'f3', title:'PSC Geography Regional Focus',     questions:50,  duration:50,  difficulty:'Medium', attempts:5400,  tag:'PSC',  rating:4.6 },
    { id:'f4', title:'PSC Economy & Agriculture',        questions:40,  duration:40,  difficulty:'Medium', attempts:4900,  tag:'PSC',  rating:4.5 },
    { id:'f5', title:'PSC Polity & Governance',          questions:50,  duration:50,  difficulty:'Medium', attempts:5800,  tag:'PSC',  rating:4.7 },
    { id:'f6', title:'PSC Current Affairs Regional',     questions:50,  duration:40,  difficulty:'Hard',   attempts:3800,  tag:'PSC',  rating:4.8 },
  ],
  GATE: [
    { id:'f1', title:'GATE CS Full Mock Test',           questions:65, duration:180, difficulty:'Hard',   attempts:12400, tag:'GATE', rating:4.8 },
    { id:'f2', title:'GATE Mathematics Practice',        questions:25, duration:60,  difficulty:'Hard',   attempts:9800,  tag:'GATE', rating:4.7 },
    { id:'f3', title:'GATE DS & Algorithms Set',         questions:20, duration:45,  difficulty:'Hard',   attempts:8200,  tag:'GATE', rating:4.8 },
    { id:'f4', title:'GATE Networks & OS Mock',          questions:20, duration:45,  difficulty:'Hard',   attempts:7600,  tag:'GATE', rating:4.7 },
    { id:'f5', title:'GATE Aptitude Practice',           questions:10, duration:20,  difficulty:'Medium', attempts:11200, tag:'GATE', rating:4.6 },
    { id:'f6', title:'GATE Previous Year 2024 Paper',    questions:65, duration:180, difficulty:'Hard',   attempts:15400, tag:'GATE', rating:4.9 },
  ],
}

const PAID_TESTS_BY_EXAM: Record<string, any[]> = {
  UPSC: [
    { id:'p1', title:'UPSC Prelims 2026 Full Series (20 Tests)', questions:100, duration:120, difficulty:'Hard',   price:499, originalPrice:999,  tag:'UPSC', rating:4.9, badge:'🔥 Best Seller', features:['AI Performance Report','Detailed Solutions','Rank Predictor','Video Explanations'] },
    { id:'p2', title:'UPSC Mains GS Answer Writing Pack',         questions:20,  duration:180, difficulty:'Hard',   price:399, originalPrice:799,  tag:'UPSC', rating:4.8, badge:'⭐ Top Rated',   features:['Expert Evaluation','Model Answers','Score Card','Improvement Tips'] },
    { id:'p3', title:'UPSC Optional Subject Test Series',         questions:100, duration:180, difficulty:'Hard',   price:599, originalPrice:1199, tag:'UPSC', rating:4.7, badge:'🎯 Optional Pack',features:['Subject-wise Breakdown','Expert Feedback','Mains Strategy'] },
  ],
  SSC: [
    { id:'p1', title:'SSC CGL Complete Test Series (15 Tests)',   questions:100, duration:60,  difficulty:'Medium', price:299, originalPrice:599,  tag:'SSC',  rating:4.7, badge:'🔥 Best Seller', features:['Section-wise Analysis','Peer Comparison','Mock Interview Tips'] },
    { id:'p2', title:'SSC CHSL + MTS Combo Pack',                 questions:100, duration:60,  difficulty:'Easy',   price:249, originalPrice:499,  tag:'SSC',  rating:4.6, badge:'💡 Combo Deal',  features:['Multi-exam Coverage','Trend Analysis','Cut-off Alerts'] },
    { id:'p3', title:'SSC CPO & GD Constable Series',             questions:100, duration:60,  difficulty:'Medium', price:199, originalPrice:399,  tag:'SSC',  rating:4.5, badge:'🏆 Police Rank', features:['Physical Test Strategy','DV Guidance','Final Merit List Prediction'] },
  ],
  BANK: [
    { id:'p1', title:'IBPS PO + Clerk Combo Series (12 Tests)',   questions:100, duration:60,  difficulty:'Medium', price:349, originalPrice:699,  tag:'BANK', rating:4.8, badge:'🔥 Best Seller', features:['Bank-specific Strategy','Cut-off Analysis','Speed Tests'] },
    { id:'p2', title:'SBI PO Prelims + Mains Full Pack',          questions:100, duration:60,  difficulty:'Hard',   price:499, originalPrice:999,  tag:'BANK', rating:4.9, badge:'⭐ Top Rated',   features:['AI Score Prediction','Interview Prep','GD Topics'] },
    { id:'p3', title:'RBI Grade B Phase-1 + Phase-2 Series',      questions:80,  duration:120, difficulty:'Hard',   price:699, originalPrice:1399, tag:'BANK', rating:4.8, badge:'💰 Premium RBI',  features:['ESI + F&M Coverage','Descriptive Evaluation','Phase-2 Strategy'] },
  ],
  RAIL: [
    { id:'p1', title:'RRB NTPC Complete Series (10 Tests)',        questions:100, duration:90,  difficulty:'Medium', price:199, originalPrice:399,  tag:'RAIL', rating:4.6, badge:'🔥 Best Seller', features:['Stage-1 & Stage-2','Category-wise Analysis','Cut-off Prediction'] },
    { id:'p2', title:'RRB Group D + ALP Combo Pack',              questions:75,  duration:90,  difficulty:'Medium', price:249, originalPrice:499,  tag:'RAIL', rating:4.7, badge:'🚂 Railway Combo',features:['Trade-specific Sets','Physical Test Guide','Final Merit List'] },
    { id:'p3', title:'RRB JE Technical Series (8 Tests)',          questions:150, duration:120, difficulty:'Hard',   price:349, originalPrice:699,  tag:'RAIL', rating:4.7, badge:'⚙️ Technical',   features:['Branch-specific Q\'s','CBT-2 Strategy','Normalization Guide'] },
  ],
  NDA: [
    { id:'p1', title:'NDA Full Series – Paper 1 & 2 (10 Tests)',  questions:270, duration:300, difficulty:'Hard',   price:399, originalPrice:799,  tag:'NDA',  rating:4.8, badge:'🔥 Best Seller', features:['SSB Guidance','Physical Fitness Tips','Merit Prediction'] },
    { id:'p2', title:'NDA Mathematics Mastery Pack',              questions:120, duration:150, difficulty:'Hard',   price:299, originalPrice:599,  tag:'NDA',  rating:4.7, badge:'📐 Maths Pack',  features:['Chapter-wise Practice','Shortcut Methods','Previous Year Analysis'] },
    { id:'p3', title:'NDA GAT (Science + GK) Series',            questions:150, duration:150, difficulty:'Medium', price:249, originalPrice:499,  tag:'NDA',  rating:4.6, badge:'🌐 GAT Special', features:['Science Deep Dive','Current Affairs','English Vocabulary'] },
  ],
  PSC: [
    { id:'p1', title:'State PSC GS Complete Test Series',         questions:100, duration:120, difficulty:'Medium', price:299, originalPrice:599,  tag:'PSC',  rating:4.6, badge:'🏛️ State Rank', features:['State-specific Questions','Regional Current Affairs','Language Support'] },
    { id:'p2', title:'PSC Mains Answer Writing Pack',             questions:20,  duration:180, difficulty:'Hard',   price:399, originalPrice:799,  tag:'PSC',  rating:4.7, badge:'⭐ Mains Pack',  features:['Expert Evaluation','State Topper Tips','Mains Strategy'] },
    { id:'p3', title:'PSC Interview Preparation Module',         questions:0,   duration:0,   difficulty:'Hard',   price:499, originalPrice:999,  tag:'PSC',  rating:4.8, badge:'🎤 Interview',   features:['Mock Interviews','Personality Test Prep','State Affairs Capsule'] },
  ],
  GATE: [
    { id:'p1', title:'GATE CS Full Series – 2026 (12 Tests)',     questions:65, duration:180, difficulty:'Hard',   price:599, originalPrice:1199, tag:'GATE', rating:4.9, badge:'🔥 Best Seller', features:['Chapter-wise Analysis','Virtual Calculator','Rank Predictor'] },
    { id:'p2', title:'GATE Maths + Aptitude Booster',            questions:35, duration:80,  difficulty:'Hard',   price:299, originalPrice:599,  tag:'GATE', rating:4.7, badge:'📐 Aptitude Pack',features:['Topic-wise Drill','Shortcut Methods','Score Booster'] },
    { id:'p3', title:'GATE Previous Year 5-Year Pack',           questions:65, duration:180, difficulty:'Hard',   price:399, originalPrice:799,  tag:'GATE', rating:4.8, badge:'📅 PYQ Series',  features:['Year-wise Solutions','Topic Frequency Analysis','Trend Graphs'] },
  ],
}

const SUBJECT_SCORES_BY_EXAM: Record<string, any[]> = {
  UPSC: [
    { subject:'History',      score:65, color:'#A78BFA' },
    { subject:'Polity',       score:78, color:'#06B6D4' },
    { subject:'Geography',    score:52, color:'#F59E0B' },
    { subject:'Economy',      score:70, color:'#22C55E' },
    { subject:'Science',      score:44, color:'#EF4444' },
    { subject:'Environment',  score:55, color:'#22C55E' },
    { subject:'Current Aff.', score:58, color:'#F59E0B' },
  ],
  SSC: [
    { subject:'Reasoning',    score:80, color:'#06B6D4' },
    { subject:'Quant Apt.',   score:65, color:'#F59E0B' },
    { subject:'English',      score:72, color:'#A78BFA' },
    { subject:'Gen. Aware.',  score:58, color:'#22C55E' },
    { subject:'Computer',     score:88, color:'#EF4444' },
  ],
  BANK: [
    { subject:'Reasoning',    score:74, color:'#06B6D4' },
    { subject:'Quant Apt.',   score:68, color:'#F59E0B' },
    { subject:'English',      score:70, color:'#A78BFA' },
    { subject:'Bank Aware.',  score:55, color:'#22C55E' },
    { subject:'Computer',     score:82, color:'#EF4444' },
  ],
  RAIL: [
    { subject:'Mathematics',  score:70, color:'#06B6D4' },
    { subject:'Reasoning',    score:76, color:'#A78BFA' },
    { subject:'Gen. Science', score:60, color:'#22C55E' },
    { subject:'Gen. Aware.',  score:54, color:'#F59E0B' },
    { subject:'Current Aff.', score:48, color:'#EF4444' },
  ],
  NDA: [
    { subject:'Mathematics',  score:62, color:'#06B6D4' },
    { subject:'Physics',      score:70, color:'#A78BFA' },
    { subject:'Chemistry',    score:65, color:'#22C55E' },
    { subject:'English',      score:78, color:'#F59E0B' },
    { subject:'History',      score:55, color:'#EF4444' },
    { subject:'Geography',    score:60, color:'#A78BFA' },
  ],
  PSC: [
    { subject:'History',      score:68, color:'#A78BFA' },
    { subject:'Polity',       score:75, color:'#06B6D4' },
    { subject:'Geography',    score:55, color:'#F59E0B' },
    { subject:'Economy',      score:62, color:'#22C55E' },
    { subject:'Environment',  score:50, color:'#EF4444' },
    { subject:'Current Aff.', score:60, color:'#A78BFA' },
  ],
  GATE: [
    { subject:'Data Struct.', score:72, color:'#06B6D4' },
    { subject:'Algorithms',   score:65, color:'#A78BFA' },
    { subject:'Mathematics',  score:58, color:'#F59E0B' },
    { subject:'Networks',     score:74, color:'#22C55E' },
    { subject:'OS & DBMS',    score:68, color:'#EF4444' },
    { subject:'Aptitude',     score:80, color:'#06B6D4' },
  ],
}

const TAG_COLORS: Record<string, string> = {
  UPSC:'#7C3AED', SSC:'#06B6D4', BANK:'#22C55E', RAIL:'#F59E0B',
  CA:'#EF4444', PSC:'#E879F9', NDA:'#F97316', GATE:'#06B6D4',
}
const diffColor = (d: string) => d === 'Easy' ? '#22C55E' : d === 'Medium' ? '#F59E0B' : '#EF4444'
type Tab = 'free' | 'paid' | 'history' | 'analytics'

const PAST_RESULTS = [
  { date:'28 Jun', exam:'Full Mock Test',    score:142, total:200, percentile:78, time:'110 min', up:true },
  { date:'22 Jun', exam:'Full Mock Test',    score:128, total:200, percentile:71, time:'118 min', up:true },
  { date:'15 Jun', exam:'Sectional Test',    score:95,  total:160, percentile:64, time:'105 min', up:false },
  { date:'8 Jun',  exam:'Practice Set',      score:168, total:200, percentile:82, time:'58 min',  up:true },
  { date:'1 Jun',  exam:'Full Mock Test',    score:110, total:200, percentile:55, time:'120 min', up:false },
]

const STYLE = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .test-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
  .test-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.4); }
  .tab-btn { border:none; background:transparent; cursor:pointer; font-family:inherit;
    padding:0.6rem 1.25rem; border-radius:10px; font-size:0.875rem; font-weight:700;
    color:rgba(255,255,255,0.45); transition:all 0.18s; white-space:nowrap; }
  .tab-btn.active { background:rgba(124,58,237,0.18); color:#A78BFA; }
  .tab-btn:hover:not(.active) { background:rgba(255,255,255,0.06); color:#fff; }
  .attempt-btn { background:linear-gradient(135deg,#7C3AED,#06B6D4); color:#fff; border:none;
    border-radius:9px; padding:0.55rem 1.1rem; font-weight:800; font-size:0.82rem;
    cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .attempt-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(124,58,237,0.4); }
  .buy-btn { background:linear-gradient(135deg,#F59E0B,#D97706); color:#fff; border:none;
    border-radius:9px; padding:0.55rem 1.25rem; font-weight:800; font-size:0.82rem;
    cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .buy-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(245,158,11,0.45); }
  .row-hover { transition:background 0.15s; }
  .row-hover:hover { background:rgba(255,255,255,0.03) !important; }
`

export default function MockTestsPageClient() {
  const { data } = trpc.student.getDashboard.useQuery()
  const targetExam = (data?.profile?.targetExam ?? 'UPSC').toUpperCase() as string

  const [tab, setTab] = useState<Tab>('free')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const FREE_TESTS   = FREE_TESTS_BY_EXAM[targetExam]   ?? FREE_TESTS_BY_EXAM['UPSC']
  const PAID_TESTS   = PAID_TESTS_BY_EXAM[targetExam]   ?? PAID_TESTS_BY_EXAM['UPSC']
  const SUBJECT_SCORES = SUBJECT_SCORES_BY_EXAM[targetExam] ?? SUBJECT_SCORES_BY_EXAM['UPSC']

  const examColor = TAG_COLORS[targetExam] ?? '#7C3AED'

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#0D0D1A', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, background:'rgba(20,30,50,0.97)', border:'1px solid rgba(124,58,237,0.4)', borderRadius:14, padding:'0.9rem 1.5rem', fontWeight:700, fontSize:'0.9rem', zIndex:9999, backdropFilter:'blur(16px)', animation:'fadeUp 0.2s ease' }}>
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background:'rgba(13,13,26,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1300, margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', gap:'1rem', height:64, flexWrap:'wrap' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:'0.9rem', flexShrink:0 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width:1, height:20, background:'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'1.3rem' }}>📝</span>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem' }}>Mock Tests</div>
            <div style={{ fontSize:'0.68rem', fontWeight:700, color: examColor }}>
              🎯 {targetExam} Exam Preparation
            </div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'0.35rem' }}>
            {(['free','paid','history','analytics'] as Tab[]).map(t => (
              <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={() => setTab(t)}>
                {t==='free'?'🆓 Free Tests':t==='paid'?'💎 Premium':t==='history'?'📋 My Results':'📈 Analytics'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1300, margin:'0 auto', padding:'2rem' }}>

        {/* ══ FREE TESTS ══ */}
        {tab === 'free' && (
          <div style={{ animation:'fadeUp 0.35s ease' }}>
            <div style={{ marginBottom:'1.5rem', background:`${examColor}12`, border:`1px solid ${examColor}30`, borderRadius:14, padding:'0.9rem 1.25rem', fontSize:'0.85rem', color:'rgba(255,255,255,0.6)' }}>
              🆓 <strong style={{ color:'#fff' }}>Free Mock Tests</strong> — specifically curated for <span style={{ color: examColor, fontWeight:800 }}>{targetExam}</span> preparation. No registration required.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'1.25rem' }}>
              {FREE_TESTS.map((test: any, i: number) => (
                <div key={test.id} className="test-card" style={{ background:'rgba(255,255,255,0.035)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'1.4rem', animation:`fadeUp 0.4s ${i*0.06}s ease both` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                    <span style={{ fontSize:'0.65rem', fontWeight:800, padding:'0.2rem 0.6rem', borderRadius:100, background:`${TAG_COLORS[test.tag]??'#7C3AED'}22`, color:TAG_COLORS[test.tag]??'#A78BFA', border:`1px solid ${TAG_COLORS[test.tag]??'#7C3AED'}44` }}>{test.tag}</span>
                    <span style={{ fontSize:'0.65rem', fontWeight:700, color:diffColor(test.difficulty), background:`${diffColor(test.difficulty)}18`, padding:'0.2rem 0.6rem', borderRadius:100 }}>{test.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize:'0.95rem', fontWeight:800, margin:'0 0 0.85rem', lineHeight:1.4 }}>{test.title}</h3>
                  <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                    {[['📋',`${test.questions} Qs`],['⏱️',`${test.duration} min`],['👥',`${(test.attempts/1000).toFixed(0)}K attempts`],['⭐',String(test.rating)]].map(([ic,val]) => (
                      <span key={val} style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.5)' }}>{ic} {val}</span>
                    ))}
                  </div>
                  <Link href={`/student/mock-tests/${test.id}-${targetExam.toLowerCase()}/take`} style={{ display:'block', textDecoration:'none' }}>
                    <button className="attempt-btn" style={{ width:'100%' }}>
                      🚀 Attempt Now →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PAID TESTS ══ */}
        {tab === 'paid' && (
          <div style={{ animation:'fadeUp 0.35s ease' }}>
            <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.08))', border:'1px solid rgba(124,58,237,0.25)', borderRadius:16, padding:'1.1rem 1.5rem', marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
              <div>
                <div style={{ fontWeight:800, fontSize:'0.95rem', marginBottom:'0.2rem' }}>💎 Premium Test Series for <span style={{ color: examColor }}>{targetExam}</span></div>
                <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.45)' }}>AI-powered analysis · Expert evaluations · Rank predictor</div>
              </div>
              <button className="buy-btn" onClick={() => showToast('⬆️ Upgrade to Pro — ₹799/year for all tests!')}>Upgrade to Pro — ₹799/yr</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))', gap:'1.25rem' }}>
              {PAID_TESTS.map((test: any, i: number) => (
                <div key={test.id} className="test-card" style={{ background:'rgba(255,255,255,0.035)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:'1.4rem', animation:`fadeUp 0.4s ${i*0.08}s ease both`, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${examColor},#06B6D4)` }} />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                    <span style={{ fontSize:'0.7rem', fontWeight:800, padding:'0.2rem 0.65rem', borderRadius:100, background:'rgba(245,158,11,0.15)', color:'#F59E0B', border:'1px solid rgba(245,158,11,0.3)' }}>{test.badge}</span>
                    <span style={{ fontSize:'0.65rem', fontWeight:700, color:diffColor(test.difficulty) }}>{test.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize:'0.95rem', fontWeight:800, margin:'0 0 0.6rem', lineHeight:1.4 }}>{test.title}</h3>
                  <div style={{ display:'flex', gap:'0.85rem', marginBottom:'0.9rem', flexWrap:'wrap' }}>
                    {test.questions > 0 && <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)' }}>📋 {test.questions} Qs</span>}
                    {test.duration > 0 && <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)' }}>⏱️ {test.duration} min</span>}
                    <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)' }}>⭐ {test.rating}</span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem', marginBottom:'1rem' }}>
                    {test.features.map((f: string) => (
                      <span key={f} style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'0.15rem 0.5rem' }}>✓ {f}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <span style={{ fontSize:'1.4rem', fontWeight:900, color:'#A78BFA' }}>₹{test.price}</span>
                      <span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.3)', textDecoration:'line-through', marginLeft:'0.4rem' }}>₹{test.originalPrice}</span>
                      <span style={{ fontSize:'0.65rem', color:'#22C55E', fontWeight:700, marginLeft:'0.4rem' }}>{Math.round((1-test.price/test.originalPrice)*100)}% off</span>
                    </div>
                    <button className="buy-btn" onClick={() => showToast(`💳 Purchasing: ${test.title}`)}>Buy Now →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ HISTORY ══ */}
        {tab === 'history' && (
          <div style={{ animation:'fadeUp 0.35s ease' }}>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden' }}>
              <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:800, fontSize:'0.9rem' }}>📋 My Test History — <span style={{ color: examColor }}>{targetExam}</span></span>
                <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)' }}>{PAST_RESULTS.length} attempts</span>
              </div>
              {PAST_RESULTS.map((r, i) => (
                <div key={i} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.05)', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', minWidth:50 }}>{r.date}</span>
                  <span style={{ flex:1, fontSize:'0.85rem', fontWeight:600 }}>{r.exam}</span>
                  <span style={{ fontSize:'0.9rem', fontWeight:800 }}>{r.score}/{r.total}</span>
                  <span style={{ fontSize:'0.75rem', color:'#06B6D4', fontWeight:700 }}>{r.percentile}th %ile</span>
                  <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)' }}>{r.time}</span>
                  <span style={{ fontSize:'0.85rem' }}>{r.up ? '📈' : '📉'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {tab === 'analytics' && (
          <div style={{ animation:'fadeUp 0.35s ease', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' }}>
            {/* Subject scores */}
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'1.5rem', gridColumn:'1/-1' }}>
              <h3 style={{ fontSize:'0.9rem', fontWeight:800, margin:'0 0 1.25rem' }}>Subject-wise Score — <span style={{ color: examColor }}>{targetExam}</span></h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                {SUBJECT_SCORES.map((s: any) => (
                  <div key={s.subject}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                      <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.65)' }}>{s.subject}</span>
                      <span style={{ fontSize:'0.82rem', fontWeight:800, color: s.score>=70?'#22C55E':s.score>=50?'#F59E0B':'#EF4444' }}>{s.score}%</span>
                    </div>
                    <div style={{ height:8, background:'rgba(255,255,255,0.07)', borderRadius:100, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${s.score}%`, background:`linear-gradient(90deg,${s.color},${s.color}99)`, borderRadius:100, transition:'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Weak areas */}
            <div style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:18, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'0.9rem', fontWeight:800, margin:'0 0 1rem', color:'#FCA5A5' }}>🎯 Focus Areas</h3>
              {SUBJECT_SCORES.filter((s:any) => s.score < 60).map((s:any) => (
                <div key={s.subject} style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize:'0.82rem' }}>{s.subject}</span>
                  <span style={{ fontSize:'0.82rem', fontWeight:800, color:'#EF4444' }}>{s.score}% — Needs Work</span>
                </div>
              ))}
              {SUBJECT_SCORES.filter((s:any) => s.score < 60).length === 0 && (
                <p style={{ fontSize:'0.82rem', color:'#22C55E', fontWeight:700 }}>✅ All subjects above 60% — Great work!</p>
              )}
            </div>
            {/* Summary */}
            <div style={{ background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:18, padding:'1.5rem' }}>
              <h3 style={{ fontSize:'0.9rem', fontWeight:800, margin:'0 0 1rem' }}>📊 Performance Summary</h3>
              {[['Tests Taken','5'],['Avg Score',`${Math.round(SUBJECT_SCORES.reduce((a:number,s:any)=>a+s.score,0)/SUBJECT_SCORES.length)}%`],['Best Percentile','82nd'],['Improvement','+12% this month']].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'0.5rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.5)' }}>{l}</span>
                  <span style={{ fontSize:'0.82rem', fontWeight:800 }}>{v}</span>
                </div>
              ))}
              <Link href="/student/ai-chat" style={{ display:'block', marginTop:'1rem', textAlign:'center', background:'rgba(124,58,237,0.18)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:9, padding:'0.55rem', fontSize:'0.8rem', fontWeight:700, color:'#A78BFA', textDecoration:'none' }}>
                🧠 Get AI Study Plan →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
