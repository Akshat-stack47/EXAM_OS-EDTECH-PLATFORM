'use client'
const STYLE = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}h2{font-size:1.05rem;font-weight:800;color:#fff;margin:2rem 0 .65rem;border-left:3px solid #0EA5E9;padding-left:.85rem}h3{font-size:.9rem;font-weight:700;color:rgba(255,255,255,.85);margin:1.25rem 0 .4rem}p,li{font-size:.88rem;line-height:1.85;color:rgba(255,255,255,.55)}ul{padding-left:1.2rem}li{margin-bottom:.3rem}a{color:#38BDF8}.chip{display:inline-block;background:rgba(14,165,233,.12);border:1px solid rgba(14,165,233,.3);border-radius:100px;padding:.25rem .75rem;font-size:.72rem;color:#38BDF8;font-weight:700;margin:.25rem .25rem 0 0}`
export default function TermsPage() {
  return (
    <div style={{ background:'#070B14', minHeight:'100vh', color:'#fff', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{STYLE}</style>
      <nav style={{ borderBottom:'1px solid rgba(255,255,255,.07)', padding:'1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(7,11,20,.97)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)' }}>
        <a href="/" style={{ fontWeight:900, fontSize:'1rem', textDecoration:'none', background:'linear-gradient(135deg,#7C3AED,#06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ExamOS ⚡</a>
        <div style={{ display:'flex', gap:'1.25rem', fontSize:'.82rem' }}>
          <a href="/privacy-policy" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Privacy</a>
          <a href="/contact" style={{ color:'rgba(255,255,255,.5)', textDecoration:'none' }}>Contact</a>
          <a href="/login" style={{ color:'#A78BFA', textDecoration:'none', fontWeight:700 }}>Sign In →</a>
        </div>
      </nav>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'2.5rem 1.5rem 5rem', animation:'fadeUp .4s ease' }}>
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.75rem' }}>
            <span className="chip">Effective: July 14, 2026</span>
            <span className="chip">Governing Law: Indian Law</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, marginBottom:'.5rem' }}>Terms of Service</h1>
          <p>These Terms of Service govern your use of ExamOS ("Platform"), operated by ExamOS Technologies Pvt. Ltd. By using ExamOS, you agree to these terms. Please read them carefully.</p>
        </div>
        <h2>1. Acceptance of Terms</h2>
        <p>By creating an account or using any ExamOS service, you affirm that you are at least 16 years old and agree to be bound by these Terms and our <a href="/privacy-policy">Privacy Policy</a>.</p>
        <h2>2. Account Responsibilities</h2>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You must not share your account with others or use another person's account</li>
          <li>You must provide accurate information during registration</li>
          <li>Notify us immediately at <a href="mailto:security@examos.in">security@examos.in</a> if you suspect unauthorised access</li>
        </ul>
        <h2>3. Permitted Use</h2>
        <p>ExamOS grants you a limited, non-exclusive, non-transferable, revocable license to use the Platform for personal exam preparation. You may NOT:</p>
        <ul>
          <li>Copy, reproduce, or distribute platform content (questions, PDFs, videos) without written permission</li>
          <li>Use automated bots, scrapers, or crawlers on the Platform</li>
          <li>Attempt to reverse-engineer, hack, or disrupt the Platform</li>
          <li>Use the Platform for commercial tutoring without an official Teacher/Coordinator account</li>
          <li>Post or share exam questions from live test sessions externally</li>
        </ul>
        <h2>4. Subscription & Payments</h2>
        <ul>
          <li>Subscriptions are billed monthly or annually as selected</li>
          <li>Payments are processed securely via Razorpay — we do not store card data</li>
          <li>Annual subscriptions are non-refundable after 7 days. Monthly subscriptions can be cancelled anytime before renewal</li>
          <li>Prices are in INR and inclusive of applicable GST</li>
          <li>We reserve the right to change pricing with 30 days advance notice</li>
        </ul>
        <h2>5. Intellectual Property</h2>
        <p>All content on ExamOS — including but not limited to questions, study plans, AI responses, videos, designs, and code — is the intellectual property of ExamOS Technologies Pvt. Ltd. or its licensors, protected under Indian copyright law.</p>
        <h2>6. AI-Generated Content Disclaimer</h2>
        <p>AI mentor responses are generated using large language models and may contain errors. Do not rely solely on AI responses for exam preparation. Always verify important facts from official government sources (UPSC, SSC, IBPS official websites).</p>
        <h2>7. Limitation of Liability</h2>
        <p>ExamOS is provided "as is". We make no guarantees regarding exam results or job placement. Our total liability for any claim is limited to the amount paid by you in the 3 months preceding the claim.</p>
        <h2>8. Termination</h2>
        <p>We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from Settings → Danger Zone.</p>
        <h2>9. Governing Law & Disputes</h2>
        <p>These Terms are governed by Indian law. Disputes will be resolved by arbitration in New Delhi under the Arbitration and Conciliation Act, 1996.</p>
        <h2>10. Contact</h2>
        <p>Legal queries: <a href="mailto:legal@examos.in">legal@examos.in</a><br />ExamOS Technologies Pvt. Ltd., New Delhi — 110001</p>
      </div>
    </div>
  )
}
