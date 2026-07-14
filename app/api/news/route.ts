import { NextResponse } from 'next/server'

/* ────────────────────────────────────────────────────────────────────
   Free RSS / JSON news sources — no API key required
   ──────────────────────────────────────────────────────────────────── */
const RSS_SOURCES: { url: string; category: string; source: string; medium: string }[] = [
  // Government of India — PIB (Press Information Bureau)
  { url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',  category: 'Governance', source: 'PIB', medium: 'English' },
  // Economic Survey / Finance Ministry — ET RSS
  { url: 'https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1368085.cms', category: 'Economy', source: 'Economic Times', medium: 'English' },
  { url: 'https://economictimes.indiatimes.com/news/politics-and-nation/rssfeeds/1052664538.cms', category: 'Polity', source: 'Economic Times', medium: 'English' },
  { url: 'https://economictimes.indiatimes.com/environment/rssfeeds/2647163.cms', category: 'Environment', source: 'Economic Times', medium: 'English' },
  { url: 'https://economictimes.indiatimes.com/tech/technology/rssfeeds/13357270.cms', category: 'Science', source: 'Economic Times', medium: 'English' },
  // Times of India
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', category: 'IR', source: 'Times of India', medium: 'English' },
  // Hindustan Times
  { url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', category: 'Polity', source: 'Hindustan Times', medium: 'English' },
]

/* Simple XML → items extractor (no library needed) */
function parseRSSItems(xml: string, source: string, category: string, medium: string) {
  const items: { title: string; summary: string; link: string; date: string; source: string; category: string; medium: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title   = stripTags(extract(block, 'title'))
    const desc    = stripTags(extract(block, 'description'))
    const link    = extract(block, 'link')
    const pubDate = extract(block, 'pubDate')
    if (!title || title.length < 5) continue
    const d = pubDate ? new Date(pubDate) : new Date()
    const dateStr = isNaN(d.getTime()) ? toLocalDateStr(new Date()) : toLocalDateStr(d)
    items.push({ title, summary: desc.slice(0, 300), link, date: dateStr, source, category, medium })
  }
  return items
}

function extract(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return (m?.[1] ?? m?.[2] ?? '').trim()
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/* ── In-memory cache (5 minute TTL) ── */
let cache: { data: any[]; at: number } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000

export async function GET() {
  try {
    /* Return cached result if fresh */
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return NextResponse.json({ articles: cache.data, cached: true })
    }

    const results: any[] = []
    const fetchPromises = RSS_SOURCES.map(async (src) => {
      try {
        const res = await fetch(src.url, {
          headers: { 'User-Agent': 'ExamOS/1.0 (educational RSS reader)' },
          signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) return
        const xml = await res.text()
        const items = parseRSSItems(xml, src.source, src.category, src.medium)
        results.push(...items)
      } catch {
        /* silently skip unavailable sources */
      }
    })

    await Promise.allSettled(fetchPromises)

    /* Sort by date descending, deduplicate by title */
    const seen = new Set<string>()
    const unique = results
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter(a => {
        const key = a.title.slice(0, 60).toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

    cache = { data: unique, at: Date.now() }
    return NextResponse.json({ articles: unique, cached: false, count: unique.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, articles: [] }, { status: 500 })
  }
}
