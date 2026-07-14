'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'

/* ─── Types ─────────────────────────────────────────────────────────── */
type Tab = 'free' | 'newspapers' | 'magazines'
type Medium = 'All' | 'English' | 'Hindi' | 'Bilingual'
type DateFilter = 'Today' | 'This Week' | 'This Month' | 'Custom'

/* ─── Free News Data ─────────────────────────────────────────────────── */
const FREE_NEWS = [
  { id: 1,  date: '2026-07-13', title: 'India-Pakistan Ceasefire: LoC Agreement & Diplomatic Implications', summary: 'Both nations agreed to restore full ceasefire along the Line of Control. Wide-ranging implications for India foreign policy and border security - critical for UPSC IR section.', tags: ['IR', 'Security', 'Polity'], medium: 'English', important: true, source: 'PIB' },
  { id: 2,  date: '2026-07-13', title: 'RBI Keeps Repo Rate at 6.5% — MPC Meeting Highlights', summary: 'The Reserve Bank of India MPC held the repo rate steady at 6.5%, signaling caution amid global headwinds. Key for UPSC Economy and Banking sections.', tags: ['Economy', 'Banking'], medium: 'English', important: true, source: 'RBI' },
  { id: 3,  date: '2026-07-12', title: 'PM KISAN Scheme — New Beneficiary Data & Digital Agriculture Push', summary: 'The government released updated beneficiary data under PM-KISAN. Over 11 crore farmers receiving ₹6,000 annually via DBT, aligning with digital agriculture initiatives.', tags: ['Agriculture', 'Welfare', 'Economy'], medium: 'Bilingual', important: false, source: 'Ministry of Agriculture' },
  { id: 4,  date: '2026-07-12', title: 'DPDP Act 2026 — Implementation Rules Notified by MeitY', summary: 'India DPDP Rules 2026 notified. Key obligations for data fiduciaries, rights of data principals, and role of Data Protection Board - critical for GS-2 Governance.', tags: ['Polity', 'Tech', 'Governance'], medium: 'English', important: true, source: 'MeitY' },
  { id: 5,  date: '2026-07-11', title: 'India GDP Growth Q4 FY26 — 7.4% Expansion Detailed Analysis', summary: "GDP grew 7.4% driven by manufacturing (+8.9%) and services (+7.1%). Agriculture at 4.2%. Key data points for UPSC Economics and Economic Survey preparation.", tags: ['Economy', 'Growth'], medium: 'English', important: false, source: 'MoSPI' },
  { id: 6,  date: '2026-07-11', title: 'ISRO Gaganyaan — Human Spaceflight Test Vehicle Mission Success', summary: 'ISRO successfully completed the TV-D1 (Test Vehicle Demonstration) for the Gaganyaan programme, validating the crew escape system. Important for Science & Technology section.', tags: ['Science', 'Space'], medium: 'English', important: false, source: 'ISRO' },
  { id: 7,  date: '2026-07-10', title: 'Supreme Court on Electoral Bonds — Unconstitutional: Full Judgment Analysis', summary: 'The SC struck down Electoral Bonds as violating Right to Information and free and fair elections under Article 19. Major precedent for Constitutional Law and Polity.', tags: ['Polity', 'Judiciary'], medium: 'English', important: true, source: 'Supreme Court' },
  { id: 8,  date: '2026-07-10', title: 'Bharat Ki Van Report 2026 — Pramukh Nishkarsh', summary: 'FSI ki Van Report 2026 ke anusar Bharat ka Van Aavaran 21.76% ho gaya. UPSC Paryavaran aur Bhugol ke liye mahatvapurn.', tags: ['Environment', 'Geography'], medium: 'Hindi', important: false, source: 'FSI' },
  { id: 9,  date: '2026-07-09', title: 'National Education Policy — Implementation Progress Report 2026', summary: 'MoE released progress report on NEP. Key achievements in multidisciplinary education, mother-tongue instruction, and credit transfer. Relevant for Social Issues and Governance.', tags: ['Education', 'Governance'], medium: 'English', important: false, source: 'MoE' },
  { id: 10, date: '2026-07-09', title: 'Semiconductor Mission India — First Fab Unit Approved in Gujarat', summary: 'The India Semiconductor Mission approved the first fabrication unit in Dholera, Gujarat. Investment: ₹91,526 crore. Key for Industrial Policy and Make in India.', tags: ['Economy', 'Tech', 'Industry'], medium: 'English', important: true, source: 'MeitY' },
  { id: 11, date: '2026-07-08', title: 'Green Hydrogen Mission — Targets, Progress & Challenges', summary: 'National Green Hydrogen Mission targets 5 MMT production by 2030. ₹19,744 crore outlay. Critical for Environment and Energy sections in UPSC Mains.', tags: ['Environment', 'Energy'], medium: 'English', important: false, source: 'MNRE' },
  { id: 12, date: '2026-07-08', title: 'Jal Jeevan Mission — 100% Gram Coverage Lakshya aur Sthiti', summary: 'Jal Jeevan Mission ke tahat ab tak 14 crore se adhik Nal Jal connection pradaan kiye gaye. UPSC ke liye Samajik Nyay aur Shasan se juda vishay.', tags: ['Welfare', 'Governance'], medium: 'Hindi', important: false, source: 'Jal Shakti Ministry' },
]

/* ─── Newspapers ─────────────────────────────────────────────────────── */
const NEWSPAPERS = [
  {
    name: 'The Hindu', logo: '🗞️', medium: 'English', type: 'newspaper',
    desc: 'India most trusted newspaper for UPSC preparation. Editorial analysis, Op-eds, and in-depth reports.',
    plans: [{ label: 'Digital - 1 Month', price: 149 }, { label: 'Digital - 6 Months', price: 699, badge: 'Best Value' }, { label: 'Digital + Print - 1 Year', price: 2499, badge: 'Best Deal' }],
    features: ['Daily UPSC-tagged articles', 'Editorial analysis', 'e-Paper access', 'Archives since 2000', 'Hindu Quiz'],
    examRelevance: 98, badge: '⭐ UPSC #1 Choice',
  },
  {
    name: 'Indian Express', logo: '📰', medium: 'English', type: 'newspaper',
    desc: 'Known for investigative journalism, political analysis and Explained section - ideal for UPSC current affairs.',
    plans: [{ label: 'Digital - 1 Month', price: 99 }, { label: 'Digital - 6 Months', price: 499, badge: 'Popular' }, { label: 'Digital - 1 Year', price: 899, badge: 'Best Deal' }],
    features: ['Explained section', 'UPSC Essentials', 'Polity & Governance focus', 'Archives access', 'Daily briefings'],
    examRelevance: 95, badge: '🔥 Most Read',
  },
  {
    name: 'Hindustan Times', logo: '📄', medium: 'English', type: 'newspaper',
    desc: 'Comprehensive coverage of national and international affairs with strong economy and science coverage.',
    plans: [{ label: 'Digital - 1 Month', price: 79 }, { label: 'Digital - 6 Months', price: 399, badge: 'Popular' }, { label: 'Digital - 1 Year', price: 699, badge: 'Best Deal' }],
    features: ['HT Smart News', 'Live coverage', 'Economy section', 'Science & Tech focus', 'Opinion pieces'],
    examRelevance: 82, badge: '💡 Good Value',
  },
  {
    name: 'Dainik Jagran', logo: '📋', medium: 'Hindi', type: 'newspaper',
    desc: 'Bharat ka sabse jyada padha jane wala Hindi akhbaar. UPSC Hindi medium ke abhyarthiyon ke liye aadarsh.',
    plans: [{ label: 'Digital - 1 Month', price: 59 }, { label: 'Digital - 6 Months', price: 299, badge: 'Popular' }, { label: 'Digital - 1 Year', price: 499, badge: 'Best Deal' }],
    features: ['Hindi UPSC Content', 'Rajniti Analysis', 'Govt Schemes', 'Editorial', 'Daily Current Affairs'],
    examRelevance: 88, badge: '🇮🇳 Hindi #1',
  },
  {
    name: 'Business Standard', logo: '💹', medium: 'English', type: 'newspaper',
    desc: 'Best for Economy, Budget, Finance & Banking sections of UPSC. In-depth macroeconomic analysis.',
    plans: [{ label: 'Digital - 1 Month', price: 129 }, { label: 'Digital - 6 Months', price: 599, badge: 'Popular' }, { label: 'Digital - 1 Year', price: 999, badge: 'Best Deal' }],
    features: ['Budget coverage', 'RBI & Monetary Policy', 'Markets explained', 'Economy deep dives', 'Expert opinions'],
    examRelevance: 90, badge: '💰 Economy Pick',
  },
  {
    name: 'The Wire + Scroll', logo: '🌐', medium: 'English', type: 'digital',
    desc: 'Independent digital journalism. Strong on civil rights, environment, and investigative reporting.',
    plans: [{ label: 'Supporter - Monthly', price: 99 }, { label: 'Supporter - Yearly', price: 999, badge: 'Best Value' }],
    features: ['Ad-free reading', 'Exclusive investigations', 'Environment & Rights', 'Science coverage', 'Multilingual'],
    examRelevance: 78, badge: '🔬 Niche Topics',
  },
]

/* ─── Magazines ─────────────────────────────────────────────────────── */
const MAGAZINES = [
  {
    name: 'Yojana', logo: '🏛️', medium: 'Bilingual', publisher: 'Ministry of I&B', price: 30, yearlyPrice: 360,
    desc: 'Government official monthly magazine. Each issue covers a UPSC-relevant theme in depth - must-read for aspirants.',
    topics: ['Government Schemes', 'Social Issues', 'Economy', 'Agriculture', 'Environment'],
    frequency: 'Monthly', examRelevance: 96, badge: '📌 Government Official',
  },
  {
    name: 'Kurukshetra', logo: '🌾', medium: 'Bilingual', publisher: 'Ministry of I&B', price: 25, yearlyPrice: 300,
    desc: 'Focused entirely on Rural Development, Agriculture, and related government schemes. Excellent for UPSC Mains GS-3.',
    topics: ['Rural Development', 'Agriculture', 'Panchayati Raj', 'Irrigation', 'Land Reforms'],
    frequency: 'Monthly', examRelevance: 90, badge: '🌱 Agriculture Must-Have',
  },
  {
    name: 'Pratiyogita Darpan', logo: '📘', medium: 'Hindi', publisher: 'Pratiyogita Darpan', price: 50, yearlyPrice: 600,
    desc: 'Bharat ki sabse lokpriya pratiyogi pareeksha patrika. UPSC, SSC, Banking sabhi ke liye upyukt.',
    topics: ['Current Affairs', 'GK', 'Previous Papers', 'Essay', 'Strategy'],
    frequency: 'Monthly', examRelevance: 85, badge: '🇮🇳 Hindi Medium Top',
  },
  {
    name: 'Civil Services Chronicle', logo: '🎯', medium: 'Bilingual', publisher: 'Chronicle Publications', price: 75, yearlyPrice: 900,
    desc: 'Comprehensive UPSC preparation magazine with current affairs, essays, and detailed subject coverage every month.',
    topics: ['UPSC Strategy', 'Current Affairs', 'Essay', 'Optional Subjects', 'Interview Tips'],
    frequency: 'Monthly', examRelevance: 92, badge: '🏆 UPSC Focused',
  },
  {
    name: 'Economic & Political Weekly', logo: '📊', medium: 'English', publisher: 'Sameeksha Trust', price: 150, yearlyPrice: 1800,
    desc: 'Academic journal essential for deep understanding of Economy, Polity, and Social Issues. Highly recommended for Mains.',
    topics: ['Political Economy', 'Social Issues', 'Data Analysis', 'Policy Critique', 'Development'],
    frequency: 'Weekly', examRelevance: 88, badge: '🎓 Academic Grade',
  },
  {
    name: 'India Today', logo: '🌟', medium: 'Bilingual', publisher: 'Living Media India', price: 50, yearlyPrice: 600,
    desc: 'India\'s leading news magazine with strong cover stories on national issues, economy, and international affairs.',
    topics: ['National Affairs', 'Economy', 'Science', 'International Relations', 'Society'],
    frequency: 'Weekly', examRelevance: 80, badge: '🔥 Popular Choice',
  },
]

/* ─── Tag Colors ─────────────────────────────────────────────────────── */
const TAG_COLORS: Record<string, string> = {
  IR: '#06B6D4', Security: '#EF4444', Economy: '#22C55E', Banking: '#F59E0B',
  Agriculture: '#A78BFA', Welfare: '#22C55E', Polity: '#7C3AED', Tech: '#06B6D4',
  Growth: '#22C55E', Science: '#F59E0B', Space: '#7C3AED', Judiciary: '#EF4444',
  Environment: '#22C55E', Energy: '#F59E0B', Education: '#06B6D4', Governance: '#7C3AED',
  Industry: '#A78BFA', Geography: '#22C55E',
}

const STYLE = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .tab-btn { border:none; background:transparent; cursor:pointer; font-family:inherit;
    padding:0.55rem 1.1rem; border-radius:10px; font-size:0.83rem; font-weight:700;
    color:rgba(255,255,255,0.4); transition:all 0.18s; white-space:nowrap;
  }
  .tab-btn.active { background:rgba(124,58,237,0.2); color:#A78BFA; }
  .tab-btn:hover:not(.active) { background:rgba(255,255,255,0.06); color:#fff; }

  .filter-btn { border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
    cursor:pointer; font-family:inherit; padding:0.38rem 0.85rem; border-radius:100px;
    font-size:0.75rem; font-weight:700; color:rgba(255,255,255,0.45); transition:all 0.18s;
  }
  .filter-btn.active { background:rgba(124,58,237,0.18); border-color:rgba(124,58,237,0.45); color:#A78BFA; }
  .filter-btn:hover:not(.active) { background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.2); }

  .card { background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.07);
    border-radius:18px; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .card:hover { transform:translateY(-3px); box-shadow:0 14px 36px rgba(0,0,0,0.4); border-color:rgba(124,58,237,0.3); }

  .buy-btn { background:linear-gradient(135deg,#7C3AED,#06B6D4); color:#fff; border:none;
    border-radius:9px; padding:0.5rem 1.1rem; font-weight:800; font-size:0.78rem;
    cursor:pointer; transition:all 0.18s; white-space:nowrap; font-family:inherit;
  }
  .buy-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(124,58,237,0.4); }

  .news-item { transition: background 0.15s; cursor:pointer; }
  .news-item:hover { background:rgba(255,255,255,0.03) !important; }

  .rel-bar { transition: width 0.8s ease; }
`

export default function CurrentAffairsPageClient() {
  const [tab, setTab] = useState<Tab>('free')
  const [medium, setMedium] = useState<Medium>('All')
  const [dateFilter, setDateFilter] = useState<DateFilter>('This Week')
  const [customDate, setCustomDate] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [mediumFilter, setMediumFilter] = useState<Medium>('All')

  /* ── Live news state ── */
  const [liveArticles, setLiveArticles] = useState<any[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<string>('')

  const fetchNews = useCallback(async () => {
    setNewsLoading(true)
    setNewsError(null)
    try {
      const res = await fetch('/api/news')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.articles && json.articles.length > 0) {
        setLiveArticles(json.articles)
        setLastFetched(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      } else {
        setNewsError('No live articles fetched — showing cached articles')
      }
    } catch (e: any) {
      setNewsError('Live feed unavailable — showing cached articles')
    } finally {
      setNewsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  /* Merge: live articles take priority, fall back to static FREE_NEWS */
  const allNewsArticles = liveArticles.length > 0 ? liveArticles : FREE_NEWS

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  /* ── Date filtering logic — uses local YYYY-MM-DD strings to avoid UTC offset issues ── */
  const localDateStr = (d: Date): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const getThresholdStr = (): string => {
    const now = new Date()
    if (dateFilter === 'Today') return localDateStr(now)
    if (dateFilter === 'This Week') { const d = new Date(now); d.setDate(d.getDate() - 7); return localDateStr(d) }
    if (dateFilter === 'This Month') { const d = new Date(now); d.setDate(d.getDate() - 30); return localDateStr(d) }
    if (dateFilter === 'Custom' && customDate) return customDate
    return '2000-01-01'
  }

  const allTags = Array.from(new Set(allNewsArticles.flatMap((n: any) => n.tags ?? [n.category ?? 'General']))).sort() as string[]

  const filteredNews = useMemo(() => {
    const threshold = getThresholdStr()
    return allNewsArticles.filter((n: any) => {
      const articleDate = (n.date ?? '').slice(0, 10)
      // For live news, skip the date filter if no date
      if (articleDate && articleDate < threshold) return false
      if (medium !== 'All' && n.medium !== medium) return false
      const articleTags: string[] = n.tags ?? (n.category ? [n.category] : [])
      if (selectedTags.length > 0 && !selectedTags.some(t => articleTags.includes(t))) return false
      if (search && !n.title?.toLowerCase().includes(search.toLowerCase()) && !n.summary?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [allNewsArticles, medium, dateFilter, customDate, selectedTags, search])

  const filteredNewspapers = useMemo(() =>
    NEWSPAPERS.filter(n => mediumFilter === 'All' || n.medium === mediumFilter), [mediumFilter])

  const filteredMagazines = useMemo(() =>
    MAGAZINES.filter(m => mediumFilter === 'All' || m.medium === mediumFilter), [mediumFilter])

  const formatDate = (ds: string) => {
    const d = new Date(ds)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff' }}>
      <style>{STYLE}</style>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'rgba(20,30,50,0.97)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 14, padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', zIndex: 9999, backdropFilter: 'blur(16px)', animation: 'fadeUp 0.2s ease' }}>
          {toast}
        </div>
      )}

      {/* ── Sticky Header ── */}
      <div style={{ background: 'rgba(13,13,26,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 64, flexWrap: 'wrap' }}>
          <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.15s', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '1.3rem' }}>📰</span>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>Current Affairs</span>
          <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {[
              { key: 'free',       label: '🆓 Free News' },
              { key: 'newspapers', label: '🗞️ Newspapers' },
              { key: 'magazines',  label: '📚 Magazines' },
            ].map(t => (
              <button key={t.key} className={`tab-btn${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key as Tab)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem' }}>

        {/* ════════ FREE NEWS ════════ */}
        {tab === 'free' && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>

            {/* Filter Bar */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>

              {/* Row 1 — Search + Date + Medium */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {/* Search */}
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="🔍  Search news…"
                  style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.55rem 1rem', color: '#fff', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.55)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />

                {/* Date Filters */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date:</span>
                  {(['Today', 'This Week', 'This Month', 'Custom'] as DateFilter[]).map(d => (
                    <button key={d} className={`filter-btn${dateFilter === d ? ' active' : ''}`} onClick={() => setDateFilter(d)}>{d}</button>
                  ))}
                  {dateFilter === 'Custom' && (
                    <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 8, padding: '0.35rem 0.65rem', color: '#A78BFA', fontSize: '0.8rem', outline: 'none' }} />
                  )}
                </div>
              </div>

              {/* Row 2 — Medium + Topic Tags */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Medium:</span>
                {(['All', 'English', 'Hindi', 'Bilingual'] as Medium[]).map(m => (
                  <button key={m} className={`filter-btn${medium === m ? ' active' : ''}`} onClick={() => setMedium(m)}>{m}</button>
                ))}

                <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Topic:</span>
                {allTags.slice(0, 10).map(tag => (
                  <button key={tag} className={`filter-btn${selectedTags.includes(tag) ? ' active' : ''}`} onClick={() => toggleTag(tag)}>{tag}</button>
                ))}
                {selectedTags.length > 0 && (
                  <button onClick={() => setSelectedTags([])} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 100, padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: '#FCA5A5', cursor: 'pointer' }}>✕ Clear</button>
                )}
              </div>
            </div>

            {/* Live Feed Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {newsLoading ? (
                  <span style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', animation: 'pulse 1s ease-in-out infinite' }} />
                    Fetching live news…
                  </span>
                ) : liveArticles.length > 0 ? (
                  <span style={{ fontSize: '0.78rem', color: '#22C55E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
                    🔴 Live · {liveArticles.length} articles · Updated {lastFetched}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 600 }}>
                    📦 Showing cached articles {newsError ? `· ${newsError}` : ''}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                  {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} shown
                  {medium !== 'All' && ` · ${medium}`}
                  {selectedTags.length > 0 && ` · ${selectedTags.join(', ')}`}
                </span>
              </div>
              <button onClick={fetchNews} disabled={newsLoading}
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, color: '#A78BFA', cursor: newsLoading ? 'not-allowed' : 'pointer', opacity: newsLoading ? 0.55 : 1, transition: 'all 0.18s' }}>
                {newsLoading ? '⏳ Refreshing…' : '↺ Refresh'}
              </button>
            </div>

            {/* Loading skeleton */}
            {newsLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem 1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
                    <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: '0.75rem', width: '40%' }} />
                    <div style={{ height: 14, background: 'rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: '0.5rem', width: '90%' }} />
                    <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 6, width: '75%' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredNews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                  <p>No articles match your filters. Try adjusting the date range or topics.</p>
                </div>
              ) : filteredNews.map((a: any, i: number) => {
                /* Support both static articles (tags[]) and live RSS articles (category string) */
                const articleTags: string[] = a.tags ?? (a.category ? [a.category] : [])
                const articleDate: string = a.date ?? ''
                const articleTitle: string = a.title ?? 'Untitled'
                const articleSummary: string = a.summary ?? a.description ?? ''
                const articleSource: string = a.source ?? ''
                const articleMedium: string = a.medium ?? 'English'
                const isImportant: boolean = a.important ?? false
                const articleKey = a.id ?? a.link ?? i

                return (
                  <div key={articleKey} className="news-item" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isImportant ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '1.25rem 1.5rem', animation: `fadeUp 0.4s ${Math.min(i * 0.04, 0.6)}s ease both`, position: 'relative', overflow: 'hidden' }}>
                    {isImportant && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#F59E0B,transparent)' }} />}

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.6rem' }}>
                      {isImportant && <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: 100, background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⭐ Important</span>}
                      {articleTags.map((t: string) => (
                        <span key={t} onClick={() => toggleTag(t)} style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: 100, background: `${TAG_COLORS[t] ?? '#7C3AED'}18`, color: TAG_COLORS[t] ?? '#A78BFA', border: `1px solid ${TAG_COLORS[t] ?? '#7C3AED'}33`, cursor: 'pointer' }}>{t}</span>
                      ))}
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, padding: '0.15rem 0.55rem', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {articleMedium}
                      </span>
                      <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                        📅 {articleDate ? formatDate(articleDate) : 'Today'} {articleSource ? `· ${articleSource}` : ''}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.45 }}>{articleTitle}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{articleSummary.slice(0, 320)}{articleSummary.length > 320 ? '…' : ''}</p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Link href="/student/ai-chat" style={{ fontSize: '0.72rem', color: '#A78BFA', fontWeight: 700, textDecoration: 'none', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 7, padding: '0.28rem 0.65rem', transition: 'all 0.15s' }}>
                        🧠 Ask AI →
                      </Link>
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '0.28rem 0.65rem', transition: 'all 0.15s' }}>
                          Read Full →
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        )}

        {/* ════════ NEWSPAPERS ════════ */}
        {tab === 'newspapers' && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            {/* Medium Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Medium:</span>
              {(['All', 'English', 'Hindi', 'Bilingual'] as Medium[]).map(m => (
                <button key={m} className={`filter-btn${mediumFilter === m ? ' active' : ''}`} onClick={() => setMediumFilter(m)}>{m}</button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{filteredNewspapers.length} newspapers</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(380px,1fr))', gap: '1.25rem' }}>
              {filteredNewspapers.map((n, i) => (
                <div key={n.name} className="card" style={{ padding: '1.5rem', animation: `fadeUp 0.4s ${i * 0.07}s ease both`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#7C3AED,#06B6D4)' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '2rem' }}>{n.logo}</span>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1rem' }}>{n.name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{n.type === 'digital' ? '🌐 Digital Only' : '📰 Print + Digital'} · {n.medium}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 100, background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.35)', whiteSpace: 'nowrap' }}>{n.badge}</span>
                  </div>

                  {/* UPSC Relevance */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>UPSC Relevance</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: n.examRelevance >= 90 ? '#22C55E' : '#F59E0B' }}>{n.examRelevance}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
                      <div className="rel-bar" style={{ height: '100%', width: `${n.examRelevance}%`, background: n.examRelevance >= 90 ? 'linear-gradient(90deg,#22C55E,#16A34A)' : 'linear-gradient(90deg,#F59E0B,#D97706)', borderRadius: 100 }} />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: '0 0 0.9rem' }}>{n.desc}</p>

                  {/* Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.1rem' }}>
                    {n.features.map(f => (
                      <span key={f} style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '0.15rem 0.5rem' }}>✓ {f}</span>
                    ))}
                  </div>

                  {/* Plans */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {n.plans.map(plan => (
                      <div key={plan.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.55rem 0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{plan.label}</span>
                          {(plan as any).badge && (
                            <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: 100, background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>{(plan as any).badge}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#A78BFA' }}>₹{plan.price}</span>
                          <button className="buy-btn" onClick={() => showToast(`📰 Subscribing to ${n.name} — ${plan.label}`)}>Subscribe</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ MAGAZINES ════════ */}
        {tab === 'magazines' && (
          <div style={{ animation: 'fadeUp 0.35s ease' }}>
            {/* Medium Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Medium:</span>
              {(['All', 'English', 'Hindi', 'Bilingual'] as Medium[]).map(m => (
                <button key={m} className={`filter-btn${mediumFilter === m ? ' active' : ''}`} onClick={() => setMediumFilter(m)}>{m}</button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{filteredMagazines.length} magazines</span>
            </div>

            {/* Govt Magazines Note */}
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                <strong style={{ color: '#22C55E' }}>Tip:</strong> Yojana and Kurukshetra are published by the Government of India and are available at very affordable prices. They are <strong style={{ color: '#fff' }}>highly recommended</strong> for UPSC Mains and are available at most post offices.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))', gap: '1.25rem' }}>
              {filteredMagazines.map((m, i) => (
                <div key={m.name} className="card" style={{ padding: '1.5rem', animation: `fadeUp 0.4s ${i * 0.07}s ease both`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#F59E0B,#06B6D4)' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '2rem' }}>{m.logo}</span>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1rem' }}>{m.name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{m.publisher} · {m.frequency} · {m.medium}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 100, background: 'rgba(245,158,11,0.18)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', whiteSpace: 'nowrap' }}>{m.badge}</span>
                  </div>

                  {/* UPSC Relevance */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>UPSC Relevance</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: m.examRelevance >= 90 ? '#22C55E' : '#F59E0B' }}>{m.examRelevance}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
                      <div className="rel-bar" style={{ height: '100%', width: `${m.examRelevance}%`, background: m.examRelevance >= 90 ? 'linear-gradient(90deg,#22C55E,#16A34A)' : 'linear-gradient(90deg,#F59E0B,#D97706)', borderRadius: 100 }} />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: '0 0 0.9rem' }}>{m.desc}</p>

                  {/* Topics */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.1rem' }}>
                    {m.topics.map(t => (
                      <span key={t} style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 100, padding: '0.15rem 0.55rem' }}>{t}</span>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.65rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#A78BFA' }}>₹{m.price}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Per Issue</div>
                    </div>
                    <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 10, padding: '0.65rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#22C55E' }}>₹{m.yearlyPrice}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Per Year</div>
                    </div>
                  </div>
                  <button className="buy-btn" style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem', fontSize: '0.85rem' }} onClick={() => showToast(`📚 Subscribing to ${m.name}`)}>
                    Subscribe Now →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
