import { useState } from 'react'
import api from '../api'

const BOT_USERNAME = 'forwork_ru_bot'

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState(1)
  const [sessionId, setSessionId] = useState('')
  const [deepLink, setDeepLink] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const startAuth = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/api/forwork/auth/start')
      setSessionId(r.data.sessionId)
      setDeepLink(r.data.telegramDeepLink)
      setStep(2)
    } catch (e) {
      setError('Ошибка соединения. Попробуйте ещё раз.')
    }
    setLoading(false)
  }

  const openTelegram = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(deepLink)
    } else {
      window.open(deepLink, '_blank')
    }
  }

  const verifyCode = async () => {
    if (code.length !== 6) return setError('Введите 6-значный код')
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/api/forwork/auth/verify', { sessionId, code })
      localStorage.setItem('fw_token', r.data.token)
      onLogin(r.data.contractor)
    } catch (e) {
      setError(e.response?.data?.error || 'Неверный код')
    }
    setLoading(false)
  }

  const resendCode = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    setError('')
    try {
      await api.post('/api/forwork/auth/resend', { sessionId })
      setResendTimer(60)
      const t = setInterval(() => {
        setResendTimer(v => { if (v <= 1) { clearInterval(t); return 0 } return v - 1 })
      }, 1000)
    } catch (e) {
      setError(e.response?.data?.error || 'Ошибка отправки')
    }
    setLoading(false)
  }

  const bg = { minHeight:'100vh', background:'linear-gradient(160deg,#0a1628 0%,#0d2137 50%,#0a1628 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:'-apple-system,sans-serif' }
  const card = { width:'100%', maxWidth:360, display:'flex', flexDirection:'column', alignItems:'center', gap:20 }
  const logo = { fontSize:48, marginBottom:8 }
  const title = { fontSize:24, fontWeight:700, color:'#fff', textAlign:'center', margin:0 }
  const subtitle = { fontSize:14, color:'rgba(255,255,255,0.5)', textAlign:'center', lineHeight:1.6, margin:0 }
  const btnPrimary = { width:'100%', padding:'16px', background:'#229ED9', color:'#fff', border:'none', borderRadius:14, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }
  const btnSecondary = { width:'100%', padding:'16px', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, fontSize:16, fontWeight:600, cursor:'not-allowed' }
  const btnGhost = { background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:14, cursor:'pointer', padding:'8px 0' }
  const inp = { width:'100%', padding:'16px', background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:14, color:'#fff', fontSize:28, outline:'none', textAlign:'center', letterSpacing:12, fontWeight:700, boxSizing:'border-box' }
  const errBox = { color:'#FCA5A5', fontSize:13, textAlign:'center', padding:'10px 16px', background:'rgba(252,165,165,0.1)', borderRadius:10, width:'100%', boxSizing:'border-box' }
  const infoBox = { background:'rgba(34,158,217,0.1)', border:'1px solid rgba(34,158,217,0.3)', borderRadius:12, padding:16, color:'#7dd3fc', fontSize:13, textAlign:'center', lineHeight:1.6, width:'100%', boxSizing:'border-box' }

  return (
    <div style={bg}>
      <div style={card}>
        {step === 1 && <>
          <div style={logo}>⚡</div>
          <h1 style={title}>ForWork</h1>
          <p style={subtitle}>Вход для исполнителей.{'\n'}Быстро и безопасно через Telegram.</p>
          <div style={{ height:8 }} />
          <button onClick={startAuth} style={btnPrimary} disabled={loading}>
            {loading ? 'Подождите...' : <><span>✈️</span> Войти через Telegram</>}
          </button>
          <button style={btnSecondary} disabled>
            Войти через Max <span style={{ fontSize:11, marginLeft:8, background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:10 }}>Скоро</span>
          </button>
        </>}

        {step === 2 && <>
          <div style={logo}>📱</div>
          <h1 style={{ ...title, fontSize:20 }}>Подтвердите вход</h1>
          <div style={infoBox}>
            Нажмите кнопку ниже — откроется наш Telegram-бот.<br/>
            Нажмите <b>Start</b> и получите код для входа.
          </div>
          <button onClick={openTelegram} style={btnPrimary}>
            ✈️ Открыть Telegram-бота
          </button>
          <button onClick={() => setStep(3)} style={{ ...btnPrimary, background:'#00B14F' }}>
            Я получил код →
          </button>
          <button onClick={() => { setStep(1); setSessionId(''); setDeepLink('') }} style={btnGhost}>
            ← Назад
          </button>
        </>}

        {step === 3 && <>
          <div style={logo}>🔐</div>
          <h1 style={{ ...title, fontSize:20 }}>Введите код</h1>
          <p style={subtitle}>Код отправлен в бот @{BOT_USERNAME}<br/>Действует 5 минут.</p>
          <input
            value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g,'').slice(0,6)); setError('') }}
            placeholder="------"
            type="tel"
            inputMode="numeric"
            maxLength={6}
            style={inp}
            autoFocus
          />
          {error && <div style={errBox}>{error}</div>}
          <button onClick={verifyCode} style={btnPrimary} disabled={loading || code.length !== 6}>
            {loading ? 'Проверка...' : '✓ Подтвердить'}
          </button>
          <button onClick={openTelegram} style={{ ...btnPrimary, background:'rgba(34,158,217,0.2)', color:'#7dd3fc' }}>
            ✈️ Открыть Telegram снова
          </button>
          <button onClick={resendCode} style={btnGhost} disabled={resendTimer > 0}>
            {resendTimer > 0 ? `Повторить через ${resendTimer}с` : 'Отправить код повторно'}
          </button>
          <button onClick={() => { setStep(2); setCode(''); setError('') }} style={btnGhost}>
            ← Назад
          </button>
        </>}
      </div>
    </div>
  )
}
