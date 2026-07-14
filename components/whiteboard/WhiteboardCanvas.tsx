'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

type Tool = 'pen' | 'eraser' | 'line' | 'rect'

const COLORS = ['#FFFFFF', '#A78BFA', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#E879F9', '#FB923C']
const SIZES = [2, 4, 8, 16]

interface Point { x: number; y: number }

interface WhiteboardCanvasProps {
  sessionId?: string
  onSave?: (dataUrl: string) => void
}

export const WhiteboardCanvas = ({ sessionId, onSave }: WhiteboardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<Point | null>(null)
  const snapshotRef = useRef<ImageData | null>(null)
  const startPoint = useRef<Point | null>(null)

  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(4)
  const [saved, setSaved] = useState(false)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const { width, height } = container.getBoundingClientRect()
    canvas.width = width || 800
    canvas.height = Math.max(height, 480)
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null

  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const touch = e.touches[0]
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY }
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const ctx = getCtx(); if (!ctx) return
    const pos = getPos(e)
    isDrawing.current = true
    lastPoint.current = pos
    startPoint.current = pos
    snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing.current) return
    const ctx = getCtx(); if (!ctx) return
    const pos = getPos(e)

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = size * 4
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (tool === 'line' && snapshotRef.current && startPoint.current) {
      ctx.putImageData(snapshotRef.current, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.beginPath()
      ctx.moveTo(startPoint.current.x, startPoint.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (tool === 'rect' && snapshotRef.current && startPoint.current) {
      ctx.putImageData(snapshotRef.current, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
      ctx.lineWidth = size
      ctx.strokeRect(
        startPoint.current.x,
        startPoint.current.y,
        pos.x - startPoint.current.x,
        pos.y - startPoint.current.y,
      )
    }
    lastPoint.current = pos
  }

  const endDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing.current) return
    isDrawing.current = false
    const ctx = getCtx(); if (!ctx) return
    ctx.globalCompositeOperation = 'source-over'
    lastPoint.current = null
    startPoint.current = null
    snapshotRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    onSave?.(dataUrl)
    // Download
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `whiteboard-${sessionId ?? 'session'}-${Date.now()}.png`
    a.click()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [sessionId, onSave])

  const btnBase: React.CSSProperties = {
    padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem',
    fontWeight: 700, transition: 'all 0.15s', border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
  }
  const btnActive: React.CSSProperties = {
    ...btnBase, background: 'rgba(124,58,237,0.25)', borderColor: 'rgba(124,58,237,0.5)', color: '#A78BFA',
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}>
        {/* Tools */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {([['pen', '✏️', 'Pen'], ['eraser', '🧹', 'Eraser'], ['line', '📏', 'Line'], ['rect', '⬜', 'Rect']] as const).map(([t, icon, label]) => (
            <button key={t} title={label} onClick={() => setTool(t)} style={tool === t ? btnActive : btnBase}>
              {icon}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

        {/* Colors */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {COLORS.map(c => (
            <button
              key={c} onClick={() => { setColor(c); setTool('pen') }}
              style={{
                width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer', border: 'none', padding: 0,
                outline: color === c ? `2px solid #A78BFA` : 'none', outlineOffset: '2px', transition: 'all 0.15s',
              }}
            />
          ))}
          <input
            type="color" value={color} onChange={e => { setColor(e.target.value); setTool('pen') }}
            style={{ width: 24, height: 24, borderRadius: 4, border: 'none', cursor: 'pointer', background: 'transparent', padding: 0 }}
            title="Custom color"
          />
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

        {/* Sizes */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => setSize(s)}
              style={{ ...( size === s ? btnActive : btnBase), padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: Math.min(s * 2, 16), height: Math.min(s * 2, 16), borderRadius: '50%', background: size === s ? '#A78BFA' : 'rgba(255,255,255,0.5)' }} />
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button onClick={clearCanvas} style={{ ...btnBase, color: '#FCA5A5', borderColor: 'rgba(239,68,68,0.3)' }}>
            🗑️ Clear
          </button>
          <button onClick={saveCanvas} style={{ ...btnBase, background: saved ? 'rgba(34,197,94,0.2)' : 'rgba(124,58,237,0.2)', borderColor: saved ? 'rgba(34,197,94,0.4)' : 'rgba(124,58,237,0.4)', color: saved ? '#22C55E' : '#A78BFA' }}>
            {saved ? '✅ Saved!' : '💾 Save PNG'}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ width: '100%', position: 'relative', userSelect: 'none' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Tool hint */}
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', userSelect: 'none', pointerEvents: 'none' }}>
          {sessionId ? `Session: ${sessionId.slice(0, 8)}` : 'Draw freely'}
        </div>
      </div>
    </div>
  )
}
