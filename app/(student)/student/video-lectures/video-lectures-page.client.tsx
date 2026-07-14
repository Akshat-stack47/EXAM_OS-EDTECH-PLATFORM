'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

/* ─── Exam → Subject mapping ──────────────────────────────────────── */
const EXAM_SUBJECTS: Record<string, string[]> = {
  UPSC: ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Science & Tech', 'Ethics', 'Art & Culture', 'Current Affairs', 'CSAT'],
  SSC:  ['Reasoning', 'English', 'Quantitative Aptitude', 'General Awareness', 'Computer'],
  BANK: ['Reasoning', 'English', 'Quantitative Aptitude', 'Banking Awareness', 'Computer', 'Current Affairs'],
  RAIL: ['Reasoning', 'General Awareness', 'Mathematics', 'General Science', 'Current Affairs'],
  PSC:  ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Current Affairs'],
  GATE: ['Mathematics', 'Reasoning', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'],
  NDA:  ['Mathematics', 'General Ability', 'English', 'Physics', 'Chemistry', 'History', 'Geography'],
}

/* ─── Curated Playlist Data ────────────────────────────────────────── */
type Playlist = {
  id: string
  title: string
  channel: string
  subject: string
  exams: string[]
  videoId: string        // YouTube video ID for thumbnail
  playlistId: string     // YouTube playlist ID
  views: number
  likes: number
  comments: number
  videos: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  language: 'English' | 'Hindi' | 'Bilingual'
  rating: number
  featured: boolean
}

const PLAYLISTS: Playlist[] = [
  // ── UPSC — History ──
  { id: 'h1', title: 'Ancient India — Complete UPSC Series', channel: 'StudyIQ IAS', subject: 'History', exams: ['UPSC', 'PSC'], videoId: 'K6nrgnxPkQ8', playlistId: 'PLZBjTezVHGHF3oLhSxkCIIV1KKO_zKfMy', views: 4200000, likes: 198000, comments: 12400, videos: 48, duration: '32h', level: 'Intermediate', language: 'Hindi', rating: 4.9, featured: true },
  { id: 'h2', title: 'Medieval India — UPSC History Lectures', channel: 'Unacademy IAS', subject: 'History', exams: ['UPSC', 'PSC'], videoId: 'sG3TCHb4i_Y', playlistId: 'PLs_xmMXXW-f8BDEFq4FRp01nzd-D3WJUM', views: 2800000, likes: 134000, comments: 8900, videos: 36, duration: '24h', level: 'Intermediate', language: 'Bilingual', rating: 4.7, featured: false },
  { id: 'h3', title: 'Modern India — Freedom Struggle & Beyond', channel: 'BYJU\'s IAS', subject: 'History', exams: ['UPSC', 'PSC', 'SSC'], videoId: 'tYCEGpnfh7c', playlistId: 'PLF9upOjNZR_sOMGTq5KA24wdWdq2M0eMC', views: 3500000, likes: 167000, comments: 10200, videos: 42, duration: '28h', level: 'Intermediate', language: 'English', rating: 4.8, featured: true },
  { id: 'h4', title: 'World History — Complete Series for UPSC Mains', channel: 'Vision IAS', subject: 'History', exams: ['UPSC'], videoId: 'NjHwZqX4mFw', playlistId: 'PLF9upOjNZR_s1UMdq2M0', views: 1900000, likes: 89000, comments: 5600, videos: 28, duration: '18h', level: 'Advanced', language: 'English', rating: 4.6, featured: false },

  // ── UPSC — Geography ──
  { id: 'g1', title: 'Physical Geography — UPSC Complete Series', channel: 'Mrunal Patel', subject: 'Geography', exams: ['UPSC', 'PSC', 'SSC'], videoId: 'lGPzpxJGRJ0', playlistId: 'PLnxfAPLanGB_bHDgcHRa1UHFjRGPxq81v', views: 5600000, likes: 278000, comments: 18700, videos: 55, duration: '40h', level: 'Intermediate', language: 'Hindi', rating: 4.9, featured: true },
  { id: 'g2', title: 'Indian Geography — Rivers, Mountains, Climate', channel: 'StudyIQ IAS', subject: 'Geography', exams: ['UPSC', 'PSC', 'SSC', 'RAIL'], videoId: 'uKMl3hYByZo', playlistId: 'PLZBjTezVHGHF3oLhS123', views: 3200000, likes: 156000, comments: 9800, videos: 40, duration: '26h', level: 'Intermediate', language: 'Hindi', rating: 4.8, featured: false },

  // ── UPSC — Polity ──
  { id: 'p1', title: 'Indian Constitution — M Laxmikanth Complete', channel: 'Mrunal Patel', subject: 'Polity', exams: ['UPSC', 'PSC', 'SSC'], videoId: 'Q5f5lMzSP1E', playlistId: 'PLnxfAPLanGB_bHDgc456', views: 7200000, likes: 345000, comments: 24600, videos: 65, duration: '48h', level: 'Intermediate', language: 'Hindi', rating: 4.9, featured: true },
  { id: 'p2', title: 'Polity GS-2 — Governance & Constitution', channel: 'BYJU\'s IAS', subject: 'Polity', exams: ['UPSC', 'PSC'], videoId: 'dqLh3JV3Kik', playlistId: 'PLF9upOjNZR_s789', views: 2900000, likes: 138000, comments: 8100, videos: 38, duration: '25h', level: 'Advanced', language: 'English', rating: 4.7, featured: false },

  // ── UPSC — Economy ──
  { id: 'e1', title: 'Indian Economy — Ramesh Singh Complete', channel: 'Mrunal Patel', subject: 'Economy', exams: ['UPSC', 'PSC', 'BANK'], videoId: 'yFz6pFJPaF4', playlistId: 'PLnxfAPLanGB_eco001', views: 6800000, likes: 320000, comments: 21000, videos: 70, duration: '52h', level: 'Intermediate', language: 'Hindi', rating: 4.9, featured: true },
  { id: 'e2', title: 'Budget 2024 Analysis for UPSC', channel: 'StudyIQ IAS', subject: 'Economy', exams: ['UPSC', 'PSC', 'BANK', 'SSC'], videoId: 'K3n8g7pR2tA', playlistId: 'PLZBjTezVHGH_budget24', views: 1800000, likes: 85000, comments: 6200, videos: 18, duration: '12h', level: 'Intermediate', language: 'Hindi', rating: 4.8, featured: false },

  // ── UPSC — Environment ──
  { id: 'env1', title: 'Environment & Ecology — UPSC Shankar IAS', channel: 'GS Score', subject: 'Environment', exams: ['UPSC', 'PSC'], videoId: 'fkJ9XwJ8pN4', playlistId: 'PLenv_shankar_001', views: 2400000, likes: 112000, comments: 7800, videos: 32, duration: '20h', level: 'Intermediate', language: 'English', rating: 4.8, featured: true },

  // ── UPSC — Science & Tech ──
  { id: 'st1', title: 'Science & Technology — Current Affairs for UPSC', channel: 'Unacademy IAS', subject: 'Science & Tech', exams: ['UPSC', 'PSC', 'SSC'], videoId: 'mT8g4J9dP0k', playlistId: 'PLsci_tech_upsc_001', views: 1600000, likes: 74000, comments: 5100, videos: 25, duration: '16h', level: 'Intermediate', language: 'English', rating: 4.7, featured: false },

  // ── UPSC — Ethics ──
  { id: 'eth1', title: 'Ethics GS-4 — Complete Lexicon by Niraj Kumar', channel: 'Niraj Kumar IAS', subject: 'Ethics', exams: ['UPSC'], videoId: 'nR4k8gL3p1Q', playlistId: 'PLethics_upsc_001', views: 1200000, likes: 58000, comments: 4200, videos: 20, duration: '14h', level: 'Advanced', language: 'Hindi', rating: 4.9, featured: true },

  // ── UPSC — CSAT ──
  { id: 'csat1', title: 'CSAT Paper-2 — Complete Mathematics & Reasoning', channel: 'Career Launcher', subject: 'CSAT', exams: ['UPSC'], videoId: 'pL7k2gT1nJ4', playlistId: 'PLcsat_upsc_001', views: 980000, likes: 45000, comments: 3200, videos: 30, duration: '20h', level: 'Beginner', language: 'Hindi', rating: 4.6, featured: false },

  // ── SSC / Banking — Reasoning ──
  { id: 'r1', title: 'Reasoning — Complete SSC CGL Series', channel: 'Adda247', subject: 'Reasoning', exams: ['SSC', 'BANK', 'RAIL'], videoId: 'jK8n3pQ2mL1', playlistId: 'PLreason_ssc_001', views: 4500000, likes: 210000, comments: 14800, videos: 80, duration: '60h', level: 'Intermediate', language: 'Hindi', rating: 4.8, featured: true },
  { id: 'r2', title: 'Reasoning Tricks — Banking PO Series', channel: 'Bank Wallah', subject: 'Reasoning', exams: ['BANK', 'SSC'], videoId: 'hP5k9mR7jQ2', playlistId: 'PLreason_bank_001', views: 3200000, likes: 152000, comments: 10400, videos: 60, duration: '45h', level: 'Intermediate', language: 'Hindi', rating: 4.7, featured: false },

  // ── SSC / Banking — Quantitative Aptitude ──
  { id: 'q1', title: 'Quantitative Aptitude — SSC CGL Complete', channel: 'Adda247', subject: 'Quantitative Aptitude', exams: ['SSC', 'BANK', 'RAIL'], videoId: 'kL2n4pR8mJ1', playlistId: 'PLquant_ssc_001', views: 5100000, likes: 242000, comments: 16200, videos: 90, duration: '70h', level: 'Intermediate', language: 'Hindi', rating: 4.8, featured: true },
  { id: 'q2', title: 'Mathematics Shortcuts — Banking Exams', channel: 'Gradeup (PW)', subject: 'Quantitative Aptitude', exams: ['BANK', 'SSC'], videoId: 'mN7p3kL9qR2', playlistId: 'PLquant_bank_001', views: 2900000, likes: 138000, comments: 9100, videos: 55, duration: '40h', level: 'Beginner', language: 'Hindi', rating: 4.7, featured: false },

  // ── SSC / Banking — English ──
  { id: 'eng1', title: 'English Grammar & Vocabulary for SSC CGL', channel: 'Adda247', subject: 'English', exams: ['SSC', 'BANK', 'NDA'], videoId: 'pJ4k7mN2qL8', playlistId: 'PLeng_ssc_001', views: 3800000, likes: 178000, comments: 11600, videos: 65, duration: '48h', level: 'Intermediate', language: 'Hindi', rating: 4.7, featured: true },

  // ── Banking Awareness ──
  { id: 'ba1', title: 'Banking Awareness — Complete Series for IBPS', channel: 'Bank Wallah', subject: 'Banking Awareness', exams: ['BANK'], videoId: 'qK3n8pL4mR7', playlistId: 'PLbank_aware_001', views: 2100000, likes: 99000, comments: 6800, videos: 40, duration: '28h', level: 'Intermediate', language: 'Hindi', rating: 4.8, featured: true },

  // ── NDA — Mathematics ──
  { id: 'ndamath', title: 'NDA Mathematics — Complete Course', channel: 'Career Launcher', subject: 'Mathematics', exams: ['NDA', 'GATE'], videoId: 'rL6k2pN8mQ3', playlistId: 'PLnda_math_001', views: 1400000, likes: 65000, comments: 4500, videos: 45, duration: '35h', level: 'Intermediate', language: 'Hindi', rating: 4.7, featured: false },

  // ── Current Affairs (all exams) ──
  { id: 'ca1', title: 'Daily Current Affairs — All Exams 2026', channel: 'StudyIQ IAS', subject: 'Current Affairs', exams: ['UPSC', 'SSC', 'BANK', 'RAIL', 'PSC', 'NDA'], videoId: 'sT4k9mR2pL1', playlistId: 'PLca_daily_2026_001', views: 8900000, likes: 420000, comments: 28000, videos: 365, duration: '200h', level: 'Intermediate', language: 'Bilingual', rating: 4.9, featured: true },
  { id: 'ca2', title: 'Monthly Current Affairs — UPSC & SSC', channel: 'Adda247', subject: 'Current Affairs', exams: ['UPSC', 'SSC', 'BANK', 'RAIL'], videoId: 'uN8p3kL6qR4', playlistId: 'PLca_monthly_2026', views: 4200000, likes: 198000, comments: 13100, videos: 48, duration: '36h', level: 'Beginner', language: 'Hindi', rating: 4.8, featured: false },

  // ── Art & Culture ──
  { id: 'ac1', title: 'Indian Art & Culture — UPSC Complete Series', channel: 'BYJU\'s IAS', subject: 'Art & Culture', exams: ['UPSC', 'PSC'], videoId: 'vK2n7pM8qL3', playlistId: 'PLart_culture_001', views: 1500000, likes: 71000, comments: 5200, videos: 25, duration: '16h', level: 'Intermediate', language: 'English', rating: 4.7, featured: false },

  // ── General Science ──
  { id: 'gsc1', title: 'General Science — RRB NTPC & SSC', channel: 'Adda247', subject: 'General Science', exams: ['RAIL', 'SSC', 'NDA'], videoId: 'wL3k9nP4mQ8', playlistId: 'PLgen_sci_rrb_001', views: 2700000, likes: 128000, comments: 8800, videos: 50, duration: '32h', level: 'Beginner', language: 'Hindi', rating: 4.7, featured: true },

  // ── General Awareness ──
  { id: 'ga1', title: 'General Awareness — SSC & Railway Complete', channel: 'Gradeup (PW)', subject: 'General Awareness', exams: ['SSC', 'RAIL', 'BANK'], videoId: 'xM4p2kL7nQ1', playlistId: 'PLgen_aware_001', views: 3400000, likes: 161000, comments: 10900, videos: 55, duration: '38h', level: 'Beginner', language: 'Hindi', rating: 4.6, featured: false },
]

type SortBy = 'Featured' | 'Most Viewed' | 'Most Liked' | 'Most Comments' | 'Most Videos'
type LevelFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced'
type LangFilter = 'All' | 'English' | 'Hindi' | 'Bilingual'

const fmt = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n)

/* Build a guaranteed-working YouTube search URL */
const ytSearch = (title: string, channel: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${channel} full playlist`)}`

const ytChannelSearch = (channel: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(channel + ' UPSC playlist')}` 

const LEVEL_COLORS = { Beginner: '#22C55E', Intermediate: '#F59E0B', Advanced: '#EF4444' }
const LANG_COLORS  = { English: '#06B6D4', Hindi: '#A78BFA', Bilingual: '#22C55E' }

const STYLE = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .pl-card { background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.08);
    border-radius:18px; overflow:hidden; transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .pl-card:hover { transform:translateY(-4px); box-shadow:0 18px 48px rgba(0,0,0,0.5); border-color:rgba(124,58,237,0.35); }

  .tab-btn { border:none; background:transparent; cursor:pointer; font-family:inherit;
    padding:0.5rem 1rem; border-radius:9px; font-size:0.82rem; font-weight:700;
    color:rgba(255,255,255,0.4); transition:all 0.18s; white-space:nowrap;
  }
  .tab-btn.active { background:rgba(124,58,237,0.2); color:#A78BFA; }
  .tab-btn:hover:not(.active) { background:rgba(255,255,255,0.06); color:#fff; }

  .filter-btn { border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
    cursor:pointer; font-family:inherit; padding:0.35rem 0.8rem; border-radius:100px;
    font-size:0.73rem; font-weight:700; color:rgba(255,255,255,0.45); transition:all 0.18s;
  }
  .filter-btn.active { background:rgba(124,58,237,0.18); border-color:rgba(124,58,237,0.45); color:#A78BFA; }
  .filter-btn:hover:not(.active) { background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.2); }

  .watch-btn { background:linear-gradient(135deg,#FF0000,#CC0000); color:#fff; border:none;
    border-radius:9px; padding:0.55rem 1.1rem; font-weight:800; font-size:0.8rem;
    cursor:pointer; transition:all 0.18s; display:flex; align-items:center; gap:0.4rem;
    text-decoration:none; font-family:inherit;
  }
  .watch-btn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(255,0,0,0.4); }

  .thumb-overlay { position:absolute; inset:0; background:rgba(0,0,0,0); transition:background 0.2s; display:flex; align-items:center; justify-content:center; }
  .pl-card:hover .thumb-overlay { background:rgba(0,0,0,0.3); }
  .play-icon { opacity:0; transform:scale(0.8); transition:all 0.2s; }
  .pl-card:hover .play-icon { opacity:1; transform:scale(1); }
`

export default function VideoLecturesPageClient() {
  const { data } = trpc.student.getDashboard.useQuery()
  const targetExam = (data?.profile?.targetExam ?? 'UPSC').toUpperCase()

  const [activeSubject, setActiveSubject] = useState('All')
  const [sortBy, setSortBy] = useState<SortBy>('Featured')
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('All')
  const [langFilter, setLangFilter] = useState<LangFilter>('All')
  const [search, setSearch] = useState('')

  /* Subjects available for this exam */
  const examSubjects = ['All', ...(EXAM_SUBJECTS[targetExam] ?? EXAM_SUBJECTS['UPSC'])]

  /* Filtered & sorted playlists */
  const filtered = useMemo(() => {
    let list = PLAYLISTS.filter(p => {
      /* Match exam */
      if (!p.exams.includes(targetExam)) return false
      /* Match subject tab */
      if (activeSubject !== 'All' && p.subject !== activeSubject) return false
      /* Level */
      if (levelFilter !== 'All' && p.level !== levelFilter) return false
      /* Language */
      if (langFilter !== 'All' && p.language !== langFilter) return false
      /* Search */
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.channel.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    switch (sortBy) {
      case 'Most Viewed':   list = [...list].sort((a, b) => b.views - a.views); break
      case 'Most Liked':    list = [...list].sort((a, b) => b.likes - a.likes); break
      case 'Most Comments': list = [...list].sort((a, b) => b.comments - a.comments); break
      case 'Most Videos':   list = [...list].sort((a, b) => b.videos - a.videos); break
      default:              list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }
    return list
  }, [targetExam, activeSubject, sortBy, levelFilter, langFilter, search])

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff' }}>
      <style>{STYLE}</style>

      {/* ── Sticky Header ── */}
      <div style={{ background: 'rgba(13,13,26,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 64, flexWrap: 'wrap' }}>
          <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.15s', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '1.3rem' }}>▶️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Video Lectures</div>
            <div style={{ fontSize: '0.68rem', color: '#EF4444', fontWeight: 700 }}>
              🎯 Showing playlists for <span style={{ color: '#FF6B6B' }}>{targetExam}</span>
            </div>
          </div>
          {/* Stats */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#A78BFA' }}>{filtered.length}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Playlists</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#22C55E' }}>{filtered.reduce((a, p) => a + p.videos, 0)}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Videos</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '2rem' }}>

        {/* ── Subject Tabs ── */}
        <div style={{ overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', minWidth: 'max-content' }}>
            {examSubjects.map(s => (
              <button key={s} className={`tab-btn${activeSubject === s ? ' active' : ''}`} onClick={() => setActiveSubject(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search playlists or channels…"
            style={{ flex: '1 1 200px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '0.5rem 0.9rem', color: '#fff', fontSize: '0.83rem', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.55)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

          {/* Sort */}
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sort:</span>
          {(['Featured', 'Most Viewed', 'Most Liked', 'Most Comments', 'Most Videos'] as SortBy[]).map(s => (
            <button key={s} className={`filter-btn${sortBy === s ? ' active' : ''}`} onClick={() => setSortBy(s)}>
              {s === 'Most Viewed' ? '👁️ Most Viewed' : s === 'Most Liked' ? '❤️ Most Liked' : s === 'Most Comments' ? '💬 Most Comments' : s === 'Most Videos' ? '📋 Most Videos' : '⭐ Featured'}
            </button>
          ))}

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

          {/* Level */}
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Level:</span>
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as LevelFilter[]).map(l => (
            <button key={l} className={`filter-btn${levelFilter === l ? ' active' : ''}`} onClick={() => setLevelFilter(l)}>{l}</button>
          ))}

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

          {/* Language */}
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Language:</span>
          {(['All', 'English', 'Hindi', 'Bilingual'] as LangFilter[]).map(l => (
            <button key={l} className={`filter-btn${langFilter === l ? ' active' : ''}`} onClick={() => setLangFilter(l)}>{l}</button>
          ))}
        </div>

        {/* ── Results info ── */}
        <div style={{ marginBottom: '1.25rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
          {filtered.length} playlist{filtered.length !== 1 ? 's' : ''} for <span style={{ color: '#A78BFA' }}>{targetExam}</span>
          {activeSubject !== 'All' && <> · <span style={{ color: '#06B6D4' }}>{activeSubject}</span></>}
          {` · Sorted by ${sortBy}`}
        </div>

        {/* ── Playlist Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎬</div>
            <p style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No playlists found</p>
            <p style={{ fontSize: '0.85rem' }}>Try adjusting the filters or selecting a different subject</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.25rem' }}>
            {filtered.map((p, i) => (
              <div key={p.id} className="pl-card" style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s`, animation: 'fadeUp 0.4s ease both' }}>

                {/* Thumbnail */}
                <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden', background: '#111' }}>
                  <img
                    src={`https://img.youtube.com/vi/${p.videoId}/maxresdefault.jpg`}
                    alt={p.title}
                    onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg` }}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Overlay */}
                  <div className="thumb-overlay">
                    <div className="play-icon" style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                      ▶
                    </div>
                  </div>
                  {/* Badges */}
                  {p.featured && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg,#F59E0B,#D97706)', borderRadius: 6, padding: '0.18rem 0.55rem', fontSize: '0.62rem', fontWeight: 800, color: '#fff' }}>
                      ⭐ FEATURED
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.85)', borderRadius: 6, padding: '0.18rem 0.55rem', fontSize: '0.68rem', fontWeight: 700 }}>
                    {p.videos} videos · {p.duration}
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.8)', borderRadius: 6, padding: '0.18rem 0.55rem', fontSize: '0.65rem', fontWeight: 700, color: LEVEL_COLORS[p.level] }}>
                    {p.level}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '1.1rem' }}>
                  {/* Tags row */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.12rem 0.5rem', borderRadius: 100, background: 'rgba(124,58,237,0.18)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.3)' }}>{p.subject}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.12rem 0.5rem', borderRadius: 100, background: `${LANG_COLORS[p.language]}18`, color: LANG_COLORS[p.language], border: `1px solid ${LANG_COLORS[p.language]}33` }}>{p.language}</span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>⭐ {p.rating}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, lineHeight: 1.4, margin: '0 0 0.35rem', color: '#fff' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 600, margin: '0 0 0.85rem' }}>📺 {p.channel}</p>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[
                      { icon: '👁️', label: 'Views',    val: fmt(p.views) },
                      { icon: '❤️', label: 'Likes',    val: fmt(p.likes) },
                      { icon: '💬', label: 'Comments', val: fmt(p.comments) },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.4rem 0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>{s.icon} {s.val}</div>
                        <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.1rem' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={ytSearch(p.title, p.channel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-btn"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      ▶ Watch Playlist
                    </a>
                    <a
                      href={ytChannelSearch(p.channel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '0.55rem 0.85rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
                    >
                      Channel →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
