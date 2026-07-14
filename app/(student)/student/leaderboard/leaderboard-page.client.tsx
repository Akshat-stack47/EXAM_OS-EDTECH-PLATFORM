'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

/* ─── Leaderboard seed data (simulates Redis sorted-set fetch) ──── */
const generateLeaderboard = (exam: string, userRank: number) => {
  const names = [
    'Arjun Singh','Priya Sharma','Rahul Gupta','Sneha Patel','Vikram Rao',
    'Kavita Mishra','Amit Kumar','Nisha Joshi','Rohit Verma','Ananya Iyer',
    'Deepak Tiwari','Sunita Nair','Sanjay Dubey','Meera Pillai','Karan Mehta',
    'Divya Pandey','Suresh Reddy','Pooja Agarwal','Nikhil Jain','Ritu Srivastava',
    'Abhishek Yadav','Sonal Bhatt','Manoj Khanna','Preeti Chauhan','Vivek Shukla',
    'Asha Khatri','Rajesh Nair','Tanvi Shah','Gaurav Pal','Smita Das',
  ]
  const states = ['Delhi','UP','Maharashtra','Tamil Nadu','Gujarat','Rajasthan','MP','Karnataka','Bihar','WB']
  const seed = exam.charCodeAt(0)

  const entries = names.map((name, i) => ({
    rank: i + 1,
    name,
    state: states[(i + seed) % states.length],
    score: Math.max(50, 98 - i * 1.8 + ((seed * i) % 3) - 0.5).toFixed(1),
    testsGiven: Math.floor(25 - i * 0.6 + (seed % 5)),
    streak: Math.max(1, 45 - i * 1.3).toFixed(0),
    xp: Math.floor(8000 - i * 220 + (seed * 10)),
    badge: i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i < 10 ? '⭐' : '',
    isMe: i + 1 === userRank,
  }))

  // insert user's own row if rank > 30
  const userEntry = {
    rank: userRank,
    name: 'You',
    state: 'Your State',
    score: (entries[userRank - 1]?.score ?? '52.4'),
    testsGiven: 8,
    streak: '12',
    xp: 2450,
    badge: '',
    isMe: true,
  }

  return { top30: entries, userEntry: userRank > 30 ? userEntry : null }
}

const EXAM_ACCENT: Record<string, string> = {
  UPSC:'#7C3AED', SSC:'#06B6D4', BANK:'#22C55E', RAIL:'#F59E0B', NDA:'#F97316', PSC:'#E879F9', GATE:'#3B82F6',
}

const STYLE = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes countUp { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  .row-hover { transition:background 0.15s; }
  .row-hover:hover { background:rgba(255,255,255,0.04) !important; }
  .exam-btn { border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); cursor:pointer;
    font-family:inherit; padding:0.38rem 0.9rem; border-radius:100px; font-size:0.75rem;
    font-weight:700; color:rgba(255,255,255,0.45); transition:all 0.18s; }
  .exam-btn.active { border-color:rgba(124,58,237,0.5); background:rgba(124,58,237,0.18); color:#A78BFA; }
`

export default function LeaderboardPageClient() {
  const { data } = trpc.student.getDashboard.useQuery()
  const targetExam = (data?.profile?.targetExam ?? 'UPSC').toUpperCase()
  const userRank   = data?.profile?.nationalRank ?? 1847
  const userName   = data?.profile?.name ?? 'You'

  const [activeExam, setActiveExam] = useState(targetExam)
  const [animKey, setAnimKey]       = useState(0)

  useEffect(() => { setActiveExam(targetExam) }, [targetExam])

  const accent = EXAM_ACCENT[activeExam] ?? '#7C3AED'
  const { top30, userEntry } = generateLeaderboard(activeExam, activeExam === targetExam ? userRank : 0)

  const handleExamChange = (exam: string) => {
    setActiveExam(exam)
    setAnimKey(k => k + 1)
  }

  const rankColor = (r: number) => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : r <= 10 ? '#A78BFA' : 'rgba(255,255,255,0.55)'

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#0D0D1A', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>

      {/* ── Header ── */}
      <div style={{ background:'rgba(13,13,26,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', gap:'1rem', height:64, flexWrap:'wrap' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:'0.9rem' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#fff'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width:1, height:20, background:'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'1.3rem' }}>🏆</span>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem' }}>National Leaderboard</div>
            <div style={{ fontSize:'0.68rem', fontWeight:700, color:accent }}>🎯 {activeExam} — Live Rankings</div>
          </div>
          {/* Live indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:100, padding:'0.25rem 0.65rem', marginLeft:'auto' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#22C55E', animation:'pulse 2s ease infinite' }} />
            <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#22C55E' }}>LIVE</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem' }}>

        {/* ── Your Rank Card ── */}
        <div style={{ background:`linear-gradient(135deg,${accent}18,rgba(6,182,212,0.08))`, border:`1px solid ${accent}35`, borderRadius:20, padding:'1.5rem 2rem', marginBottom:'1.75rem', display:'flex', gap:'2rem', alignItems:'center', flexWrap:'wrap', animation:'fadeUp 0.35s ease' }}>
          <div style={{ textAlign:'center', minWidth:80 }}>
            <div style={{ fontSize:'2.8rem', fontWeight:900, color:accent, animation:'countUp 0.6s ease', lineHeight:1 }}>
              #{activeExam === targetExam ? userRank.toLocaleString() : '—'}
            </div>
            <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.07em', marginTop:'0.25rem' }}>Your Rank</div>
          </div>
          <div style={{ width:1, height:48, background:'rgba(255,255,255,0.1)' }} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', marginBottom:'0.2rem' }}>{activeExam === targetExam ? userName : 'Switch to your exam to see rank'}</div>
            <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.45)' }}>
              {activeExam === targetExam
                ? `You are in the top ${((userRank / 200000) * 100).toFixed(1)}% of all ${activeExam} aspirants`
                : `Select ${targetExam} to see your personal rank`}
            </div>
          </div>
          {activeExam === targetExam && (
            <div style={{ display:'flex', gap:'1.25rem' }}>
              {[['🔥 Streak','12 days'],['⚡ XP','2,450'],['📋 Tests','8']].map(([l,v]) => (
                <div key={l as string} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'0.9rem', fontWeight:800 }}>{v}</div>
                  <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginTop:'0.1rem' }}>{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Exam Filter ── */}
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', alignSelf:'center', marginRight:'0.25rem' }}>Exam:</span>
          {['UPSC','SSC','BANK','RAIL','NDA','GATE','PSC'].map(e => (
            <button key={e} className={`exam-btn${activeExam===e?' active':''}`} onClick={() => handleExamChange(e)}>
              {e} {e === targetExam ? '(You)' : ''}
            </button>
          ))}
        </div>

        {/* ── Top 3 Podium ── */}
        <div style={{ display:'flex', gap:'0.85rem', marginBottom:'1.5rem', justifyContent:'center', alignItems:'flex-end', height:160 }}>
          {[1, 0, 2].map(idx => {
            const p = top30[idx]
            const heights = [120, 148, 100]
            const podiumH = heights[idx === 1 ? 0 : idx === 0 ? 1 : 2]
            const podiumAccent = idx === 0 ? '#C0C0C0' : idx === 1 ? '#FFD700' : '#CD7F32'
            return (
              <div key={p.rank} style={{ flex:1, maxWidth:200, display:'flex', flexDirection:'column', alignItems:'center', animation:`fadeUp 0.4s ${idx*0.1}s ease both` }}>
                <div style={{ fontSize:'1.4rem', marginBottom:'0.3rem' }}>{p.badge}</div>
                <div style={{ fontSize:'0.75rem', fontWeight:800, textAlign:'center', marginBottom:'0.4rem', color:'#fff' }}>{p.name}</div>
                <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.4rem' }}>{p.state}</div>
                <div style={{ height:podiumH, width:'100%', background:`linear-gradient(180deg,${podiumAccent}22,${podiumAccent}08)`, border:`1px solid ${podiumAccent}44`, borderRadius:'12px 12px 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.25rem' }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:900, color:podiumAccent }}>#{p.rank}</div>
                  <div style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(255,255,255,0.7)' }}>{p.score}%</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Full Rankings Table ── */}
        <div key={animKey} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden' }}>
          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'60px 1fr 100px 80px 80px 70px', gap:'0.5rem', padding:'0.75rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:'0.65rem', fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
            <span>Rank</span><span>Student</span><span>Score</span><span>Tests</span><span>Streak</span><span>XP</span>
          </div>

          {/* Top 30 rows */}
          {top30.map((row, i) => (
            <div key={row.rank} className="row-hover"
              style={{ display:'grid', gridTemplateColumns:'60px 1fr 100px 80px 80px 70px', gap:'0.5rem', padding:'0.8rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', background: row.isMe ? `${accent}0C` : 'transparent', animation:`fadeUp 0.3s ${Math.min(i*0.03,0.6)}s ease both` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                <span style={{ fontSize:'0.85rem', fontWeight:900, color:rankColor(row.rank), minWidth:24 }}>#{row.rank}</span>
                <span style={{ fontSize:'0.9rem' }}>{row.badge}</span>
              </div>
              <div>
                <div style={{ fontSize:'0.85rem', fontWeight: row.isMe ? 900 : 600, color: row.isMe ? accent : '#fff' }}>
                  {row.isMe ? `⭐ ${row.name} (You)` : row.name}
                </div>
                <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.35)', marginTop:'0.1rem' }}>{row.state}</div>
              </div>
              <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#A78BFA' }}>{row.score}%</div>
              <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.55)' }}>{row.testsGiven}</div>
              <div style={{ fontSize:'0.82rem', color:'#F59E0B' }}>🔥 {row.streak}d</div>
              <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.55)' }}>{row.xp.toLocaleString()}</div>
            </div>
          ))}

          {/* User's row if outside top 30 */}
          {userEntry && activeExam === targetExam && (
            <>
              <div style={{ padding:'0.5rem 1.5rem', textAlign:'center', fontSize:'0.68rem', color:'rgba(255,255,255,0.2)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                · · · {(userEntry.rank - 30).toLocaleString()} more aspirants · · ·
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'60px 1fr 100px 80px 80px 70px', gap:'0.5rem', padding:'0.8rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', background:`${accent}12`, border:`1px solid ${accent}22` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                  <span style={{ fontSize:'0.85rem', fontWeight:900, color:accent }}>#{userEntry.rank.toLocaleString()}</span>
                </div>
                <div>
                  <div style={{ fontSize:'0.85rem', fontWeight:900, color:accent }}>⭐ {userName} (You)</div>
                  <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.35)' }}>Your State</div>
                </div>
                <div style={{ fontSize:'0.85rem', fontWeight:700, color:'#A78BFA' }}>{userEntry.score}%</div>
                <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.55)' }}>{userEntry.testsGiven}</div>
                <div style={{ fontSize:'0.82rem', color:'#F59E0B' }}>🔥 {userEntry.streak}d</div>
                <div style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.55)' }}>{userEntry.xp.toLocaleString()}</div>
              </div>
            </>
          )}
        </div>

        {/* ── How to improve rank ── */}
        <div style={{ marginTop:'1.5rem', background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', borderRadius:16, padding:'1.25rem 1.5rem', display:'flex', gap:'1.5rem', alignItems:'center', flexWrap:'wrap' }}>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.88rem', marginBottom:'0.3rem' }}>🚀 Improve Your Rank</div>
            <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)' }}>Take more mock tests & maintain your streak to climb the leaderboard</div>
          </div>
          <div style={{ display:'flex', gap:'0.6rem', marginLeft:'auto' }}>
            <Link href="/student/mock-tests" style={{ background:'linear-gradient(135deg,#7C3AED,#06B6D4)', color:'#fff', textDecoration:'none', borderRadius:9, padding:'0.55rem 1.1rem', fontSize:'0.8rem', fontWeight:800 }}>Take a Mock Test →</Link>
            <Link href="/student/pyq" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)', textDecoration:'none', borderRadius:9, padding:'0.55rem 1.1rem', fontSize:'0.8rem', fontWeight:700 }}>Solve PYQs</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
