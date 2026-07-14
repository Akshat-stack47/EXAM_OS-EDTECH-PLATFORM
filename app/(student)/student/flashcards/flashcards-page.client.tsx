'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ─── Data ─────────────────────────────────────────── */
const DECKS = [
  {
    id: 'polity', name: 'Indian Polity', icon: '⚖️', color: '#7C3AED', count: 8,
    cards: [
      { q: 'Which Article abolishes untouchability?', a: 'Article 17 — Abolition of Untouchability. Its practice in any form is forbidden.' },
      { q: 'What is the minimum age to become the President of India?', a: '35 years. Must also be a citizen of India and eligible to be elected as a member of Lok Sabha.' },
      { q: 'The Preamble of the Indian Constitution was adopted on?', a: '26 November 1949 — also celebrated as Constitution Day (Samvidhan Diwas).' },
      { q: 'Article 32 is called the "Heart and Soul" of the Constitution by whom?', a: 'Dr. B.R. Ambedkar. It gives citizens the right to move the Supreme Court to enforce Fundamental Rights.' },
      { q: 'How many members does the Rajya Sabha have at maximum?', a: '250 members — 238 elected representatives of states/UTs + 12 nominated by the President.' },
      { q: 'The Directive Principles of State Policy are borrowed from?', a: 'The Constitution of Ireland (Eire). They are non-justiciable guidelines for the State.' },
      { q: 'Which Schedule contains the anti-defection law?', a: '10th Schedule, added by the 52nd Constitutional Amendment Act, 1985.' },
      { q: 'Article 370 dealt with?', a: 'Special status of Jammu & Kashmir. Abrogated on August 5, 2019 by the Government of India.' },
    ]
  },
  {
    id: 'history', name: 'Modern History', icon: '🏛️', color: '#F59E0B', count: 8,
    cards: [
      { q: 'Who founded the Indian National Congress in 1885?', a: 'A.O. Hume (Allan Octavian Hume), a retired British civil servant, in Bombay on 28 December 1885.' },
      { q: 'The Partition of Bengal was done by which Viceroy?', a: 'Lord Curzon in 1905. It divided Bengal into East Bengal (Muslim majority) and West Bengal (Hindu majority). Reversed in 1911.' },
      { q: 'The Jallianwala Bagh Massacre occurred in which year?', a: '13 April 1919, in Amritsar. General Dyer ordered firing on unarmed civilians gathered for Baisakhi. About 379+ killed.' },
      { q: 'Non-Cooperation Movement was launched in?', a: '1920–1922 by Mahatma Gandhi. The movement was called off after the Chauri Chaura incident in February 1922.' },
      { q: 'Who gave the slogan "Do or Die" (Karo Ya Maro)?', a: 'Mahatma Gandhi during the Quit India Movement (August 8, 1942) at the Gowalia Tank Maidan, Bombay.' },
      { q: 'The Indian Independence Act was passed on?', a: '18 July 1947 by the British Parliament. It created the two dominions of India and Pakistan from 15 August 1947.' },
      { q: 'Simon Commission came to India in?', a: '1928. It was boycotted across India with the slogan "Simon Go Back" because it had no Indian member.' },
      { q: 'Champaran Satyagraha (1917) was related to?', a: 'Indigo farmers of Champaran, Bihar. Gandhi\'s first major civil disobedience movement in India against the Tinkathia system.' },
    ]
  },
  {
    id: 'geography', name: 'Indian Geography', icon: '🗺️', color: '#22C55E', count: 8,
    cards: [
      { q: 'Which is the longest river in India?', a: 'The Ganga at approximately 2,525 km. It originates from Gangotri Glacier in Uttarakhand and flows into the Bay of Bengal.' },
      { q: 'The Western Ghats is also known as?', a: 'Sahyadri. It runs parallel to the western coast of India for about 1,600 km from Gujarat to Kerala.' },
      { q: 'Which state has the longest coastline in India?', a: 'Gujarat — approximately 1,600 km coastline, followed by Andhra Pradesh (~974 km).' },
      { q: 'The Deccan Plateau is bounded by which mountain ranges?', a: 'Bounded by the Vindhyas and Satpuras to the north, Western Ghats to the west, Eastern Ghats to the east.' },
      { q: 'Chilika Lake is located in which state?', a: 'Odisha. It is the largest brackish water lagoon in Asia and an important bird sanctuary (Ramsar site).' },
      { q: 'Which pass connects Himachal Pradesh to Ladakh?', a: 'Rohtang Pass (3,979 m) and Baralacha La. The Atal Tunnel now provides all-weather connectivity through Rohtang.' },
      { q: 'The Sundarbans delta is formed by which rivers?', a: 'Ganga and Brahmaputra (combined as the Padma). Located in West Bengal and Bangladesh — largest mangrove forest in the world.' },
      { q: 'Which Indian state shares borders with maximum states?', a: 'Uttar Pradesh — shares boundaries with 8 states: Uttarakhand, Himachal Pradesh, Haryana, Rajasthan, MP, Chhattisgarh, Jharkhand, Bihar.' },
    ]
  },
  {
    id: 'economy', name: 'Indian Economy', icon: '📈', color: '#0EA5E9', count: 6,
    cards: [
      { q: 'GST was implemented in India on?', a: '1 July 2017. It replaced multiple indirect taxes and introduced "One Nation One Tax" with rates of 0%, 5%, 12%, 18%, 28%.' },
      { q: 'NITI Aayog stands for?', a: 'National Institution for Transforming India. Replaced Planning Commission on 1 January 2015. It is a think tank, not a plan allocator.' },
      { q: 'The Reserve Bank of India was established in?', a: '1 April 1935 under the Reserve Bank of India Act, 1934. Nationalised in 1949. Headquarters: Mumbai.' },
      { q: 'What is the base year for India\'s current GDP calculation?', a: '2011-12. Changed from 2004-05. Uses GVA (Gross Value Added) at basic prices + Net taxes on products.' },
      { q: 'Fiscal deficit means?', a: 'The gap between total government expenditure and total revenue receipts excluding borrowings. Indicates government borrowing needs.' },
      { q: 'MUDRA stands for?', a: 'Micro Units Development & Refinance Agency. Provides loans up to ₹10 lakh to micro-enterprises (Shishu/Kishore/Tarun categories).' },
    ]
  },
  {
    id: 'science', name: 'Science & Tech', icon: '🔬', color: '#EC4899', count: 6,
    cards: [
      { q: 'What is the speed of light in vacuum?', a: '3 × 10⁸ m/s (299,792,458 m/s). Denoted by "c". It is the cosmic speed limit — nothing can travel faster.' },
      { q: 'DNA stands for?', a: 'Deoxyribonucleic Acid. Double helix structure discovered by Watson & Crick in 1953. Carries genetic information.' },
      { q: 'Chandrayaan-3 successfully landed on the Moon on?', a: '23 August 2023 near the lunar south pole. India became the 4th country to achieve a soft lunar landing.' },
      { q: 'What is the SI unit of electric resistance?', a: 'Ohm (Ω), named after Georg Ohm. Ohm\'s Law: V = IR (Voltage = Current × Resistance).' },
      { q: 'Photosynthesis equation (simplified)?', a: '6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂. Occurs in the chloroplasts using chlorophyll.' },
      { q: 'What is Operation Sindoor (2025)?', a: 'India\'s precision military operation in May 2025 targeting 9 terror camps in Pakistan and PoK, following the Pahalgam terror attack.' },
    ]
  },
]

/* ─── Styles ─────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes flipIn   { from{transform:rotateY(90deg);opacity:0} to{transform:rotateY(0);opacity:1} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  @keyframes pop      { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
  .deck-card { border-radius:18px; padding:1.1rem 1.25rem; cursor:pointer; transition:all .2s; border:1.5px solid transparent; }
  .deck-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,.4); }
  .deck-card.selected { border-color:currentColor; }
  .flip-card { perspective:1000px; cursor:pointer; }
  .flip-inner { position:relative; transform-style:preserve-3d; transition:transform .55s cubic-bezier(.4,.2,.2,1); width:100%; height:100%; }
  .flip-inner.flipped { transform:rotateY(180deg); }
  .flip-face { position:absolute; top:0; left:0; width:100%; height:100%; backface-visibility:hidden; border-radius:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2.5rem; text-align:center; }
  .flip-back { transform:rotateY(180deg); }
  .action-btn { border:none; border-radius:14px; font-family:inherit; font-weight:800; font-size:.9rem; cursor:pointer; padding:.7rem 1.6rem; transition:all .2s; }
  .progress-ring { transition:stroke-dashoffset .5s ease; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
`

type Card = { q: string; a: string }
type Deck = typeof DECKS[number]
type Rating = 'again' | 'hard' | 'good' | 'easy'

export default function FlashcardsClient() {
  const [activeDeck, setActiveDeck]   = useState<Deck | null>(null)
  const [cardIdx,    setCardIdx]      = useState(0)
  const [flipped,    setFlipped]      = useState(false)
  const [showAnswer, setShowAnswer]   = useState(false)
  const [ratings,    setRatings]      = useState<Record<number, Rating>>({})
  const [done,       setDone]         = useState(false)
  const [shake,      setPop]          = useState(false)
  const [sessionStats, setStats]      = useState({ easy:0, good:0, hard:0, again:0 })

  const startDeck = (deck: Deck) => {
    setActiveDeck(deck); setCardIdx(0); setFlipped(false); setShowAnswer(false)
    setRatings({}); setDone(false); setStats({ easy:0, good:0, hard:0, again:0 })
  }
  const exitDeck = () => { setActiveDeck(null); setDone(false) }

  const flipCard = () => {
    setFlipped(f => !f)
    if (!showAnswer) setShowAnswer(true)
  }

  const rate = useCallback((r: Rating) => {
    if (!activeDeck) return
    setRatings(prev => ({...prev, [cardIdx]: r}))
    setStats(s => ({...s, [r]: s[r] + 1}))
    setPop(true); setTimeout(() => setPop(false), 300)
    setTimeout(() => {
      if (cardIdx + 1 >= activeDeck.cards.length) { setDone(true) }
      else { setCardIdx(i => i + 1); setFlipped(false); setShowAnswer(false) }
    }, 200)
  }, [activeDeck, cardIdx])

  useEffect(() => {
    if (!activeDeck) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); flipCard() }
      if (showAnswer) {
        if (e.key === '1') rate('again')
        if (e.key === '2') rate('hard')
        if (e.key === '3') rate('good')
        if (e.key === '4') rate('easy')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeDeck, showAnswer, rate])

  const card: Card | undefined = activeDeck?.cards[cardIdx]
  const progress = activeDeck ? Math.round((cardIdx / activeDeck.cards.length) * 100) : 0

  /* ── DECK SELECTION SCREEN ── */
  if (!activeDeck) return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff' }}>
      <style>{STYLE}</style>
      {/* Header */}
      <div style={{ background:'rgba(7,11,20,.98)', borderBottom:'1px solid rgba(255,255,255,.07)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)', padding:'0 1.5rem', height:58, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <Link href="/student/dashboard" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.85rem' }}>← Dashboard</Link>
          <div style={{ width:1, height:16, background:'rgba(255,255,255,.12)' }} />
          <div style={{ fontWeight:900, fontSize:'.95rem' }}>🃏 Flashcards</div>
        </div>
        <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.3)', fontWeight:700 }}>Spaced Repetition Learning</div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1.5rem 4rem' }}>
        <div style={{ marginBottom:'2rem', animation:'fadeUp .4s ease' }}>
          <h1 style={{ fontSize:'clamp(1.4rem,3vw,1.9rem)', fontWeight:900, marginBottom:'.4rem' }}>Choose a Deck to Study</h1>
          <p style={{ color:'rgba(255,255,255,.4)', fontSize:'.88rem' }}>Cards rated "Again" or "Hard" will reappear sooner — spaced repetition maximises retention.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
          {DECKS.map((d, i) => (
            <div key={d.id} className="deck-card" onClick={() => startDeck(d)}
              style={{ background:`${d.color}10`, border:`1.5px solid ${d.color}30`, animation:`fadeUp .4s ${i*.06}s ease both` }}>
              <div style={{ fontSize:'2rem', marginBottom:'.6rem' }}>{d.icon}</div>
              <div style={{ fontWeight:900, fontSize:'1rem', marginBottom:'.25rem', color:'#fff' }}>{d.name}</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', marginBottom:'.85rem' }}>{d.count} cards</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ height:4, flex:1, background:'rgba(255,255,255,.08)', borderRadius:2, marginRight:'.75rem', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:'35%', background:`linear-gradient(90deg,${d.color},${d.color}99)`, borderRadius:2 }} />
                </div>
                <div style={{ fontSize:'.68rem', color:d.color, fontWeight:800 }}>35% done</div>
              </div>
              <button style={{ width:'100%', marginTop:'.85rem', background:`${d.color}20`, border:`1px solid ${d.color}40`, color:d.color, borderRadius:12, padding:'.55rem', fontFamily:'inherit', fontWeight:800, fontSize:'.82rem', cursor:'pointer' }}>
                Study Now →
              </button>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={{ background:'rgba(124,58,237,.06)', border:'1px solid rgba(124,58,237,.15)', borderRadius:18, padding:'1.25rem 1.5rem', animation:'fadeUp .4s .3s ease both' }}>
          <div style={{ fontWeight:800, fontSize:'.88rem', marginBottom:'.75rem', color:'#A78BFA' }}>⌨️ Keyboard Shortcuts</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.65rem', fontSize:'.78rem', color:'rgba(255,255,255,.5)' }}>
            {[['Space','Flip card'],['1','Again'],['2','Hard'],['3','Good'],['4','Easy']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                <kbd style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', borderRadius:6, padding:'.2rem .5rem', fontFamily:'inherit', fontSize:'.72rem', fontWeight:800, color:'#fff' }}>{k}</kbd>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  /* ── SESSION COMPLETE SCREEN ── */
  if (done) {
    const total = activeDeck.cards.length
    const mastered = sessionStats.easy + sessionStats.good
    const pct = Math.round((mastered / total) * 100)
    return (
      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <style>{STYLE}</style>
        <div style={{ textAlign:'center', maxWidth:480, animation:'fadeUp .5s ease' }}>
          <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
          <h1 style={{ fontWeight:900, fontSize:'1.6rem', marginBottom:'.4rem' }}>Session Complete!</h1>
          <p style={{ color:'rgba(255,255,255,.4)', marginBottom:'2rem' }}>{activeDeck.name} · {total} cards reviewed</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'.75rem', marginBottom:'2rem' }}>
            {[
              { label:'Easy',   count:sessionStats.easy,  color:'#22C55E', icon:'😊' },
              { label:'Good',   count:sessionStats.good,  color:'#0EA5E9', icon:'👍' },
              { label:'Hard',   count:sessionStats.hard,  color:'#F59E0B', icon:'😅' },
              { label:'Again',  count:sessionStats.again, color:'#EF4444', icon:'🔁' },
            ].map(s => (
              <div key={s.label} style={{ background:`${s.color}12`, border:`1px solid ${s.color}30`, borderRadius:14, padding:'1rem', textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem' }}>{s.icon}</div>
                <div style={{ fontWeight:900, fontSize:'1.4rem', color:s.color, marginTop:'.2rem' }}>{s.count}</div>
                <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', marginTop:'.1rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="action-btn" onClick={() => startDeck(activeDeck)} style={{ background:'linear-gradient(135deg,#7C3AED,#4F46E5)', color:'#fff' }}>🔄 Study Again</button>
            <button className="action-btn" onClick={exitDeck} style={{ background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.12)' }}>Choose Deck</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── STUDY SCREEN ── */
  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:'#070B14', minHeight:'100vh', color:'#fff', display:'flex', flexDirection:'column' }}>
      <style>{STYLE}</style>

      {/* Top bar */}
      <div style={{ background:'rgba(7,11,20,.98)', borderBottom:'1px solid rgba(255,255,255,.07)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)', padding:'0 1.5rem', height:58, display:'flex', alignItems:'center', gap:'1rem', justifyContent:'space-between' }}>
        <button onClick={exitDeck} style={{ background:'none', border:'none', color:'rgba(255,255,255,.4)', fontFamily:'inherit', fontSize:'.85rem', cursor:'pointer' }}>← Decks</button>
        <div style={{ flex:1, maxWidth:320 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.7rem', color:'rgba(255,255,255,.35)', fontWeight:700, marginBottom:'.3rem' }}>
            <span style={{ color:activeDeck.color }}>{activeDeck.name}</span>
            <span>{cardIdx + 1} / {activeDeck.cards.length}</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,.07)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${progress}%`, background:`linear-gradient(90deg,${activeDeck.color},${activeDeck.color}99)`, borderRadius:2, transition:'width .35s ease' }} />
          </div>
        </div>
        <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', fontWeight:700, display:'flex', gap:'.65rem' }}>
          {[['😊', sessionStats.easy, '#22C55E'],['👍', sessionStats.good, '#0EA5E9'],['😅', sessionStats.hard, '#F59E0B'],['🔁', sessionStats.again, '#EF4444']].map(([ic,n,c]) => (
            <span key={ic as string} style={{ color: Number(n) > 0 ? c as string : 'rgba(255,255,255,.2)' }}>{ic} {n as number}</span>
          ))}
        </div>
      </div>

      {/* Card area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem', gap:'1.5rem' }}>
        {/* Flip card */}
        <div className="flip-card" style={{ width:'100%', maxWidth:600, height:280 }} onClick={flipCard}>
          <div className={`flip-inner${flipped ? ' flipped' : ''}`} style={{ animation: shake ? 'pop .3s ease' : 'none' }}>
            {/* Front */}
            <div className="flip-face" style={{ background:'rgba(255,255,255,.05)', border:'1.5px solid rgba(255,255,255,.1)' }}>
              <div style={{ fontSize:'.7rem', fontWeight:800, color:'rgba(255,255,255,.3)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'1.25rem' }}>Question · Tap to reveal</div>
              <div style={{ fontWeight:700, fontSize:clamp('1rem','2.5vw','1.25rem'), lineHeight:1.65, color:'#F0F0FF' }}>{card?.q}</div>
              <div style={{ marginTop:'1.25rem', fontSize:'.75rem', color:'rgba(255,255,255,.2)' }}>Space to flip</div>
            </div>
            {/* Back */}
            <div className="flip-face flip-back" style={{ background:`linear-gradient(135deg,${activeDeck.color}18,${activeDeck.color}08)`, border:`1.5px solid ${activeDeck.color}40` }}>
              <div style={{ fontSize:'.7rem', fontWeight:800, color:`${activeDeck.color}`, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'1rem' }}>Answer</div>
              <div style={{ fontWeight:600, fontSize:'.95rem', lineHeight:1.75, color:'rgba(255,255,255,.85)' }}>{card?.a}</div>
            </div>
          </div>
        </div>

        {/* Rating buttons — only show after flip */}
        {showAnswer ? (
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', justifyContent:'center', animation:'fadeUp .3s ease' }}>
            {[
              { r:'again' as Rating, label:'Again', sub:'<1m',  color:'#EF4444', icon:'🔁' },
              { r:'hard'  as Rating, label:'Hard',  sub:'<10m', color:'#F59E0B', icon:'😅' },
              { r:'good'  as Rating, label:'Good',  sub:'4d',   color:'#0EA5E9', icon:'👍' },
              { r:'easy'  as Rating, label:'Easy',  sub:'7d+',  color:'#22C55E', icon:'😊' },
            ].map(b => (
              <button key={b.r} className="action-btn" onClick={() => rate(b.r)}
                style={{ background:`${b.color}15`, border:`1.5px solid ${b.color}40`, color:b.color, minWidth:90, display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem', padding:'.7rem 1.25rem' }}>
                <span style={{ fontSize:'1.1rem' }}>{b.icon}</span>
                <span style={{ fontWeight:900, fontSize:'.85rem' }}>{b.label}</span>
                <span style={{ fontSize:'.6rem', color:`${b.color}99`, fontWeight:700 }}>{b.sub}</span>
              </button>
            ))}
          </div>
        ) : (
          <button className="action-btn" onClick={flipCard} style={{ background:'linear-gradient(135deg,#7C3AED,#4F46E5)', color:'#fff', padding:'.8rem 2.5rem', fontSize:'1rem' }}>
            Show Answer →
          </button>
        )}

        {/* Skip */}
        <button onClick={() => { if (cardIdx + 1 >= (activeDeck?.cards.length ?? 0)) setDone(true); else { setCardIdx(i=>i+1); setFlipped(false); setShowAnswer(false) } }}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,.2)', fontFamily:'inherit', fontSize:'.75rem', cursor:'pointer', textDecoration:'underline' }}>
          Skip this card
        </button>
      </div>
    </div>
  )
}

function clamp(min: string, val: string, max: string) { return `clamp(${min},${val},${max})` }
