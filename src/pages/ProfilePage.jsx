import { useState, useEffect } from 'react'
import api from '../api.js'

export default function ProfilePage({ onLogout }) {
  const [contractor, setContractor] = useState(null)

  useEffect(() => {
    api.get('/api/forwork/my-orders').then(r => {
      const done = r.data.filter(o => o.status === 'done')
      const total = done.reduce((s,o) => s + Number(o.executor_cost || 0), 0)
      setContractor({ orders: r.data.length, done: done.length, total })
    }).catch(() => {})
  }, [])

  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.5px', marginBottom:20 }}>Профиль</div>

      <div style={{ background:'linear-gradient(135deg, var(--dark), #2E3A47)', borderRadius:20, padding:24, marginBottom:20, color:'#fff', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:32, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div style={{ fontSize:18, fontWeight:700 }}>Исполнитель</div>
      </div>

      {contractor && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { label:'Всего заказов', value: contractor.orders },
            { label:'Выполнено', value: contractor.done },
            { label:'Заработано', value: contractor.total.toLocaleString('ru') + ' ₽' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:'#fff', borderRadius:14, padding:'14px 10px', textAlign:'center', boxShadow:'var(--shadow)' }}>
              <div style={{ fontSize:18, fontWeight:800, color:'var(--orange)' }}>{value}</div>
              <div style={{ fontSize:11, color:'var(--gray)', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <button onClick={onLogout}
          style={{ width:'100%', padding:'16px 20px', background:'none', border:'none', textAlign:'left', fontSize:15, color:'var(--red)', fontWeight:600, borderTop:'1px solid var(--border)' }}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  )
}
