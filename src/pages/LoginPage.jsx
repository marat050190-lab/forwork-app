import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isNew, setIsNew] = useState(false)
  const nav = useNavigate()

  const sendCode = async () => {
    if (phone.replace(/\D/g,'').length < 10) return setError('Введите корректный номер')
    setLoading(true); setError('')
    try {
      const r = await api.post('/api/forwork/send-code', { phone })
      setIsNew(r.data.isNew)
      if (r.data.code) setCode(r.data.code) // тест
      setStep(2)
    } catch(e) { setError(e.response?.data?.error || 'Ошибка') }
    setLoading(false)
  }

  const verifyCode = async () => {
    setLoading(true); setError('')
    try {
      const r = await api.post('/api/forwork/verify-code', { phone, code })
      if (r.data.isNew) {
        nav('/register', { state: { phone } })
      } else {
        onLogin(r.data.token)
      }
    } catch(e) { setError(e.response?.data?.error || 'Неверный код') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ marginBottom:40, textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:20, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        </div>
        <div style={{ fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>ForWork</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.45)', marginTop:6 }}>Платформа для исполнителей</div>
      </div>

      <div style={{ width:'100%', maxWidth:360 }}>
        {step === 1 ? (
          <>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Номер телефона</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (900) 000-00-00" type="tel"
                style={{ width:'100%', padding:'14px 16px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:12, color:'#fff', fontSize:16, outline:'none' }} />
            </div>
            {error && <div style={{ color:'#FCA5A5', fontSize:13, marginBottom:12 }}>{error}</div>}
            <button onClick={sendCode} disabled={loading}
              style={{ width:'100%', padding:'15px', background:'var(--orange)', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:700, boxShadow:'0 4px 20px rgba(0,177,79,0.3)' }}>
              {loading ? 'Отправка...' : 'Получить код'}
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>или</div>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
            </div>
            <a href="https://t.me/forwork_ru_bot" target="_blank"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'15px', background:'#229ED9', color:'#fff', borderRadius:12, fontSize:16, fontWeight:700, textDecoration:'none' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8.02c-.12.56-.46.7-.93.43l-2.57-1.9-1.24 1.19c-.14.14-.25.25-.51.25l.18-2.6 4.74-4.28c.21-.18-.04-.28-.32-.1L7.46 14.5l-2.52-.79c-.55-.17-.56-.55.12-.81l9.86-3.8c.45-.17.85.11.72.7z"/></svg>
              Зарегистрироваться через Telegram
            </a>
          </>
        ) : (
          <>
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:8 }}>Код из Telegram</label>
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="000000" type="number" maxLength={6}
                style={{ width:'100%', padding:'14px 16px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:12, color:'#fff', fontSize:24, outline:'none', textAlign:'center', letterSpacing:8, fontWeight:700 }} />
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20, textAlign:'center' }}>Код отправлен на {phone}</div>
            {error && <div style={{ color:'#FCA5A5', fontSize:13, marginBottom:12, textAlign:'center' }}>{error}</div>}
            <button onClick={verifyCode} disabled={loading}
              style={{ width:'100%', padding:'15px', background:'var(--orange)', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:700, marginBottom:12 }}>
              {loading ? 'Проверка...' : 'Войти'}
            </button>
            <button onClick={() => { setStep(1); setError('') }}
              style={{ width:'100%', padding:'13px', background:'transparent', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, fontSize:14 }}>
              Изменить номер
            </button>
          </>
        )}
      </div>
    </div>
  )
}
