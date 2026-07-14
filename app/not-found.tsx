import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      background:'#070B14', minHeight:'100vh', color:'#fff',
      fontFamily:"'Inter',system-ui,sans-serif", display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', textAlign:'center', padding:'2rem'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        .link-btn { padding:.7rem 1.5rem; border-radius:12px; font-family:inherit; font-weight:800; font-size:.9rem; cursor:pointer; transition:all .2s; text-decoration:none; display:inline-block; }
        .link-btn:hover { transform:translateY(-2px); }
      `}</style>

      {/* Glowing 404 */}
      <div style={{ position:'relative', marginBottom:'1.5rem', animation:'float 3s ease infinite' }}>
        <div style={{
          fontSize:'clamp(6rem,20vw,10rem)', fontWeight:900, lineHeight:1,
          background:'linear-gradient(135deg,#7C3AED,#06B6D4)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          filter:'drop-shadow(0 0 40px rgba(124,58,237,0.4))',
        }}>404</div>
        <div style={{
          position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:'140%', height:'140%', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(124,58,237,.12) 0%,transparent 70%)',
          pointerEvents:'none', zIndex:-1,
        }} />
      </div>

      {/* Emoji */}
      <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🌌</div>

      {/* Message */}
      <h1 style={{ fontSize:'clamp(1.3rem,3vw,1.8rem)', fontWeight:900, marginBottom:'.6rem', animation:'fadeUp .4s ease' }}>
        This page went on exam leave
      </h1>
      <p style={{ color:'rgba(255,255,255,.45)', maxWidth:400, lineHeight:1.75, marginBottom:'2rem', fontSize:'.92rem', animation:'fadeUp .4s .05s ease both' }}>
        The page you're looking for doesn't exist — or maybe it moved to study for UPSC. Either way, let's get you back on track.
      </p>

      {/* Action buttons */}
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', animation:'fadeUp .4s .1s ease both' }}>
        <Link href="/student/dashboard" className="link-btn"
          style={{ background:'linear-gradient(135deg,#7C3AED,#4F46E5)', color:'#fff', boxShadow:'0 0 20px rgba(124,58,237,.35)' }}>
          Go to Dashboard →
        </Link>
        <Link href="/" className="link-btn"
          style={{ background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.12)' }}>
          Back to Home
        </Link>
        <Link href="/contact" className="link-btn"
          style={{ background:'rgba(255,255,255,.05)', color:'rgba(255,255,255,.5)', border:'1px solid rgba(255,255,255,.08)', fontSize:'.8rem' }}>
          Report Issue
        </Link>
      </div>

      {/* ExamOS branding */}
      <div style={{ marginTop:'3rem', display:'flex', alignItems:'center', gap:'.5rem', opacity:.35 }}>
        <span style={{ width:24, height:24, borderRadius:6, background:'linear-gradient(135deg,#7C3AED,#06B6D4)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>⚡</span>
        <span style={{ fontSize:'.8rem', fontWeight:800 }}>ExamOS</span>
      </div>
    </div>
  )
}
