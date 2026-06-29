import { useState, useEffect } from 'react'
import api from '../api.js'

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState(1) // 1 - выбор, 2 - ввод кода
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const verifyCode = async () => {
    if (!phone || !code) return setError('Введите номер и код')
    setLoading(true); setError('')
    try {
      const r = await api.post('/api/forwork/verify-code', { phone, code })
      onLogin(r.data.token)
    } catch(e) { setError('Неверный код') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#1C1C2E', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ marginBottom:40, textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:24, background:'#00B14F', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        </div>
        <div style={{ fontSize:32, fontWeight:800, color:'#fff' }}>ForWork</div>
        <div style={{ fontSize:15, color:'rgba(255,255,255,0.4)', marginTop:8 }}>Платформа для исполнителей</div>
      </div>

      {step === 1 ? (
        <div style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:16 }}>
          <a href="https://t.me/forwork_ru_bot"
            onClick={() => setStep(2)}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, width:'100%', padding:'18px', background:'#229ED9', color:'#fff', borderRadius:16, fontSize:17, fontWeight:700, textDecoration:'none' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8.02c-.12.56-.46.7-.93.43l-2.57-1.9-1.24 1.19c-.14.14-.25.25-.51.25l.18-2.6 4.74-4.28c.21-.18-.04-.28-.32-.1L7.46 14.5l-2.52-.79c-.55-.17-.56-.55.12-.81l9.86-3.8c.45-.17.85.11.72.7z"/></svg>
            Войти через Telegram
          </a>
          <button disabled style={{ width:'100%', padding:'18px', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, fontSize:17, fontWeight:700, cursor:'not-allowed' }}>
            Войти через Max <span style={{ fontSize:11, marginLeft:8, background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:10 }}>Скоро</span>
          </button>
          <button onClick={() => setStep(2)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:14, cursor:'pointer', marginTop:8 }}>
            Уже получили код? Ввести →
          </button>
        </div>
      ) : (
        <div style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'rgba(34,158,217,0.1)', border:'1px solid rgba(34,158,217,0.3)', borderRadius:12, padding:16, color:'#229ED9', fontSize:14, textAlign:'center' }}>
            Получите код в боте @forwork_ru_bot и введите его ниже
          </div>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (900) 000-00-00" type="tel"
            style={{ width:'100%', padding:'14px 16px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:12, color:'#fff', fontSize:16, outline:'none', boxSizing:'border-box' }} />
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Код из Telegram" type="number"
            style={{ width:'100%', padding:'14px 16px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:12, color:'#fff', fontSize:24, outline:'none', textAlign:'center', letterSpacing:8, fontWeight:700, boxSizing:'border-box' }} />
          {error && <div style={{ color:'#FCA5A5', fontSize:13, textAlign:'center' }}>{error}</div>}
          <button onClick={verifyCode} disabled={loading}
            style={{ width:'100%', padding:'16px', background:'#00B14F', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:700 }}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
          <button onClick={() => setStep(1)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:14, cursor:'pointer' }}>
            ← Назад
          </button>
        </div>
      )}
    </div>
  )
}
