'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

const QUICK_PROMPTS = [
  'Explain DPSP in 3 bullet points',
  'What is the difference between Rajya Sabha and Lok Sabha?',
  'Key points about India\'s foreign policy for UPSC',
  'Explain the Green Revolution in simple terms',
  'What are Fundamental Rights?',
  'Summarise the Economic Survey 2024',
]

type Message = { role: 'user' | 'ai'; text: string; time: string }

export default function AiChatPageClient() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hello! I'm your AI Study Mentor. Ask me anything about your exam syllabus, current affairs, or study strategies. I'm here to help! 🎓", time: 'Now' }
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const aiChat = trpc.ai.chat.useMutation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async (text?: string) => {
    const q = (text ?? input).trim()
    if (!q) return
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text: q, time }])
    setInput('')
    try {
      const result = await aiChat.mutateAsync({ message: q, examType: 'UPSC' })
      const replyTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, { role: 'ai', text: result.reply, time: replyTime }])
    } catch (e: any) {
      const replyTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${e?.message || 'AI service unavailable. Please try again.'}`, time: replyTime }])
    }
  }, [input, aiChat])

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0D0D1A', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .msg { animation: fadeUp 0.25s ease; }
        .quick-btn { background:rgba(124,58,237,0.1); border:1px solid rgba(124,58,237,0.25); border-radius:100px; padding:0.4rem 0.9rem; font-size:0.78rem; color:#A78BFA; cursor:pointer; font-weight:600; transition:all 0.18s; white-space:nowrap; }
        .quick-btn:hover { background:rgba(124,58,237,0.22); border-color:rgba(124,58,237,0.5); transform:translateY(-1px); }
        .send-btn { background:linear-gradient(135deg,#7C3AED,#06B6D4); color:#fff; border:none; border-radius:12px; padding:0.75rem 1.4rem; font-weight:800; cursor:pointer; font-size:0.9rem; transition:all 0.15s; }
        .send-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(124,58,237,0.4); }
        .send-btn:disabled { opacity:0.5; cursor:not-allowed; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'rgba(13,13,26,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 64, gap: '1rem' }}>
          <Link href="/student/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
            ← Dashboard
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🧠</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>AI Study Mentor</div>
              <div style={{ fontSize: '0.7rem', color: '#22C55E', fontWeight: 600 }}>● Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingBottom: '0.5rem' }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p} className="quick-btn" onClick={() => handleSend(p)}>{p}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} className="msg" style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.role === 'ai' ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {m.role === 'ai' ? '🧠' : '👤'}
              </div>
              <div style={{ maxWidth: '75%' }}>
                <div style={{ background: m.role === 'ai' ? 'rgba(124,58,237,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${m.role === 'ai' ? 'rgba(124,58,237,0.2)' : 'rgba(34,197,94,0.2)'}`, borderRadius: m.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px', padding: '0.85rem 1.1rem', fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem', textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}
          {aiChat.isPending && (
            <div className="msg" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
              <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '4px 18px 18px 18px', padding: '0.85rem 1.1rem' }}>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#A78BFA', animation: `pulse 1.2s ${d}s ease-in-out infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(13,13,26,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask anything… 'What is Article 370?' or 'Explain Monetary Policy'"
            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '0.85rem 1.1rem', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.55)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
          <button className="send-btn" onClick={() => handleSend()} disabled={aiChat.isPending || !input.trim()}>
            {aiChat.isPending ? '⏳' : 'Ask →'}
          </button>
        </div>
      </div>
    </div>
  )
}
