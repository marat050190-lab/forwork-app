import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api.js'

export default function RegisterPage({ onLogin }) {
  const { state } = useLocation()
  const [form, setForm] = useState({ first_name:'', last_name:'', middle_name:'', age:'', phone: state?.phone || '', is_self_employed: false, city:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)
  const set = (k,v) => setForm(f => ({...f, [k]:v}))

  useEffect(() => {
    setGeoLoading(true)
    navigator.geolocation?.getCurrentPosition(async pos => {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
        const d = await r.json()
        const city = d.address?.city || d.address?.town || d.address?.village || ''
        if (city) set('city', city)
      } catch {}
      setGeoLoading(false)
    }, () => setGeoLoading(false))
  }, [])

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.age || !form.city) return setError('Заполните все обязательные поля')
    setLoading(true); setError('')
    try {
      const r = await api.post('/api/forwork/register', form)
      onLogin(r.data.token)
    } catch(e) { setError(e.response?.data?.error || 'Ошибка') }
    setLoading(false)
  }

  const inp = { width:'100%', padding:'13px 16px', border:'1.5px solid var(--border)', borderRadius:12, fontSize:15, outline:'none', background:'#fff' }
  const lbl = { fontSize:12, fontWeight:700, color:'var(--gray)', textTransform:'uppercase', letterSpacing:'0.05em', display:'block', marginBottom:6 }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:24 }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:24, fontWeight:800, color:'var(--dark)', letterSpacing:'-0.5px' }}>Регистрация</div>
        <div style={{ fontSize:14, color:'var(--gray)', marginTop:4 }}>Заполните данные для начала работы</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div><label style={lbl}>Фамилия *</label><input value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Иванов" style={inp} /></div>
        <div><label style={lbl}>Имя *</label><input value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Иван" style={inp} /></div>
        <div><label style={lbl}>Отчество</label><input value={form.middle_name} onChange={e => set('middle_name', e.target.value)} placeholder="Иванович" style={inp} /></div>
        <div><label style={lbl}>Возраст *</label><input value={form.age} onChange={e => set('age', e.target.value)} placeholder="25" type="number" style={inp} /></div>
        <div><label style={lbl}>Телефон</label><input value={form.phone} readOnly style={{ ...inp, background:'var(--bg)', color:'var(--gray)' }} /></div>
        <div><label style={lbl}>Город * {geoLoading && '(определяем...)'}</label><input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Казань" style={inp} /></div>

        <div style={{ background:'#fff', borderRadius:12, padding:16, border:'1.5px solid var(--border)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ fontWeight:600, fontSize:15 }}>Я самозанятый</div>
            <div onClick={() => set('is_self_employed', !form.is_self_employed)}
              style={{ width:48, height:28, borderRadius:14, background: form.is_self_employed ? 'var(--orange)' : '#E2E8F0', position:'relative', cursor:'pointer', transition:'background 0.2s' }}>
              <div style={{ width:22, height:22, borderRadius:11, background:'#fff', position:'absolute', top:3, left: form.is_self_employed ? 23 : 3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
          <div style={{ fontSize:12, color:'var(--orange)', fontWeight:600 }}>Самозанятым — приоритет в получении заказов</div>
          {!form.is_self_employed && (
            <div style={{ fontSize:12, color:'var(--gray)', marginTop:6 }}>
              Не самозанятый? <a href="https://npd.nalog.ru" target="_blank" style={{ color:'var(--orange)' }}>Как стать самозанятым →</a>
            </div>
          )}
        </div>

        {error && <div style={{ color:'var(--red)', fontSize:13, padding:'10px 14px', background:'#FEF2F2', borderRadius:8 }}>{error}</div>}

        <button onClick={submit} disabled={loading}
          style={{ width:'100%', padding:'15px', background:'var(--orange)', color:'#fff', border:'none', borderRadius:12, fontSize:16, fontWeight:700, boxShadow:'0 4px 20px rgba(0,177,79,0.25)' }}>
          {loading ? 'Регистрация...' : 'Начать работу'}
        </button>
      </div>
    </div>
  )
}
