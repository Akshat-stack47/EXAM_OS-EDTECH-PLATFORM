'use client'
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  body { font-family:'Inter',system-ui,sans-serif; }
  h2 { font-size:1.05rem; font-weight:800; color:#fff; margin:2rem 0 .65rem; border-left:3px solid #7C3AED; padding-left:.85rem; }
  h3 { font-size:.9rem; font-weight:700; color:rgba(255,255,255,.85); margin:1.25rem 0 .4rem; }
  p,li { font-size:.88rem; line-height:1.85; color:rgba(255,255,255,.55); }
  ul { padding-left:1.2rem; }
  li { margin-bottom:.3rem; }
  a { color:#A78BFA; }
  .chip { display:inline-block; background:rgba(124,58,237,.15); border:1px solid rgba(124,58,237,.3); border-radius:100px; padding:.25rem .75rem; font-size:.72rem; color:#A78BFA; font-weight:700; margin:.25rem .25rem 0 0; }
`
export default function PrivacyPolicyClient() {
  return (
    <div style={{ background:'#070B14', minHeight:'100vh', color:'#fff', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{STYLE}</style>
      <nav style={{ borderBottom:'1px solid rgba(255,255,255,.07)', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(7,11,20,.97)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)' }}>
        <a href="/" style={{ fontWeight:900, fontSize:'1rem', textDecoration:'none', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ExamOS ⚡</a>
        <div style={{ display:'flex', gap:'1.25rem', fontSize:'.82rem' }}>
          <a href="/terms-of-service" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Terms</a>
          <a href="/contact" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Contact</a>
          <a href="/login" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Sign In →</a>
        </div>
      </nav>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'2.5rem 1.5rem 5rem', animation:'fadeUp .4s ease' }}>
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.75rem' }}>
            <span className="chip">DPDP Act 2023</span>
            <span className="chip">GDPR Aligned</span>
            <span className="chip">Last Updated: July 14, 2026</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.5rem' }}>Privacy Policy</h1>
          <p>ExamOS ("we", "us", "our") is committed to protecting your personal data. This policy explains how we collect, use, share, and protect information in compliance with the <strong style={{ color:'#fff' }}>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.</p>
        </div>

        <h2>1. Information We Collect</h2>
        <h3>Account Information</h3>
        <p>Name, email address, phone number, and role (student/teacher/parent) provided during registration.</p>
        <h3>Academic Data</h3>
        <p>Target exam, category (General/OBC/SC/ST/EWS), study hours, mock test responses, scores, and weak topic data — used to personalise your experience.</p>
        <h3>Usage Data</h3>
        <p>Pages visited, time spent, test attempts, study session logs. Collected automatically via server logs and in-app tracking.</p>
        <h3>Device Data</h3>
        <p>IP address, browser type, device model, OS version — for security, fraud prevention, and platform optimisation.</p>
        <h3>Payment Data</h3>
        <p>Transaction IDs processed via <strong style={{ color:'#fff' }}>Razorpay</strong>. We do NOT store card numbers or UPI credentials.</p>

        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>Provide and personalise the ExamOS platform (study plans, test recommendations, AI mentor)</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send exam alerts, streak reminders, and product notifications (opt-out available in Settings)</li>
          <li>Improve platform quality via anonymised analytics</li>
          <li>Comply with legal obligations under Indian law</li>
          <li>Detect and prevent fraud, security incidents, and abuse</li>
        </ul>
        <p style={{ marginTop:'.75rem' }}>We do <strong style={{ color:'#fff' }}>NOT</strong> sell your personal data to third parties.</p>

        <h2>3. Data Sharing</h2>
        <ul>
          <li><strong style={{ color:'#fff' }}>Teachers / Coordinators:</strong> Your progress data is visible to assigned teachers/coordinators on the platform</li>
          <li><strong style={{ color:'#fff' }}>Parents:</strong> If a parent account is linked to your account, they can view your study statistics</li>
          <li><strong style={{ color:'#fff' }}>Service Providers:</strong> Razorpay (payments), Supabase (database), Vercel (hosting), AWS S3 (file storage) — bound by data processing agreements</li>
          <li><strong style={{ color:'#fff' }}>Law Enforcement:</strong> When required by court order or applicable Indian law</li>
        </ul>

        <h2>4. Your Rights (DPDP Act 2023)</h2>
        <ul>
          <li><strong style={{ color:'#fff' }}>Right to Access:</strong> Request a copy of all your personal data we hold</li>
          <li><strong style={{ color:'#fff' }}>Right to Correction:</strong> Update inaccurate or incomplete data via Settings → Profile</li>
          <li><strong style={{ color:'#fff' }}>Right to Erasure:</strong> Request deletion of your account and data within 30 days</li>
          <li><strong style={{ color:'#fff' }}>Right to Grievance:</strong> Contact our Data Protection Officer if you believe your rights are violated</li>
          <li><strong style={{ color:'#fff' }}>Right to Withdraw Consent:</strong> Opt out of non-essential data processing at any time</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>Active accounts: retained while your account exists. Deleted accounts: hard-deleted after 30 days (soft delete period for recovery). Test results and analytics data retained in anonymised form for platform improvement.</p>

        <h2>6. Security</h2>
        <p>All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access is controlled via Row-Level Security (RLS) in Supabase. Passwords are hashed using bcrypt. We conduct regular security audits.</p>

        <h2>7. Cookies</h2>
        <p>We use essential session cookies for authentication and optional analytics cookies. You can manage cookie preferences in your browser settings.</p>

        <h2>8. Children's Privacy</h2>
        <p>ExamOS is intended for users 16 years and older. We do not knowingly collect data from children under 16 without verifiable parental consent.</p>

        <h2>9. Changes to this Policy</h2>
        <p>We may update this policy periodically. We will notify you by email and in-app notification at least 7 days before material changes take effect.</p>

        <h2>10. Contact & Grievance Officer</h2>
        <p>Data Protection Officer: <a href="mailto:privacy@examos.in">privacy@examos.in</a><br />ExamOS Technologies Pvt. Ltd., New Delhi, India — 110001</p>
        <p style={{ marginTop:'1rem' }}>For complaints or data requests, visit <a href="/contact">our Contact page</a> or email within 72 hours for acknowledgment.</p>
      </div>
    </div>
  )
}
