import { useState, useEffect } from 'react'
import api from '../api.js'

export default function ProfilePage({ onLogout }) {
  const [stats, setStats] = useState(null)
  const profile = (() => { try { return JSON.parse(localStorage.getItem('fw_contractor') || 'null') } catch { return null } })()

  useEffect(() => {
    api.get('/api/forwork/my-orders').then(r => {
      const done = r.data.filter(o => o.status === 'done')
      const total = done.reduce((s,o) => s + Number(o.executor_cost || 0), 0)
      setStats({ orders: r.data.length, done: done.length, total })
    }).catch(() => {})
  }, [])

  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.5px', marginBottom:20 }}>Профиль</div>

      <div style={{ background:'linear-gradient(135deg, var(--dark), #2E3A47)', borderRadius:20, padding:24, marginBottom:20, color:'#fff', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:32, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div style={{ fontSize:18, fontWeight:700 }}>
          {profile?.first_name ? `${profile.last_name || ''} ${profile.first_name} ${profile.middle_name || ''}`.trim() : 'Исполнитель'}
        </div>
        {profile?.city && <div style={{ fontSize:13, opacity:0.7, marginTop:4 }}>{profile.city}{profile?.age ? `, ${profile.age} лет` : ''}</div>}
        {profile?.is_self_employed && <div style={{ fontSize:11, marginTop:6, background:'var(--orange)', display:'inline-block', padding:'2px 10px', borderRadius:10 }}>Самозанятый</div>}
      </div>

      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }}>
          {[
            { label:'Всего заказов', value: stats.orders },
            { label:'Выполнено', value: stats.done },
            { label:'Заработано', value: stats.total.toLocaleString('ru') + ' ₽' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:'#fff', borderRadius:14, padding:'14px 10px', textAlign:'center', boxShadow:'var(--shadow)' }}>
              <div style={{ fontSize:18, fontWeight:800, color:'var(--orange)' }}>{value}</div>
              <div style={{ fontSize:11, color:'var(--gray)', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {!profile?.is_self_employed && (
        <div style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:20, boxShadow:'var(--shadow)' }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>Вы не самозанятый</div>
          <div style={{ fontSize:13, color:'var(--gray)', marginBottom:12 }}>
            Самозанятым доступен приоритет в получении заказов. Оформить статус можно бесплатно через приложение <a href="https://npd.nalog.ru" target="_blank" style={{ color:'var(--orange)' }}>«Мой налог»</a> за 5 минут.
          </div>
          <button onClick={async () => {
            await api.patch('/api/forwork/profile/self-employed', { contractor_id: profile.id, is_self_employed: true })
            const updated = { ...profile, is_self_employed: true }
            localStorage.setItem('fw_contractor', JSON.stringify(updated))
            window.location.reload()
          }} style={{ width:'100%', padding:'12px', background:'var(--orange)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600 }}>
            Я оформил самозанятость
          </button>
        </div>
      )}

      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <button onClick={onLogout}
          style={{ width:'100%', padding:'16px 20px', background:'none', border:'none', textAlign:'left', fontSize:15, color:'var(--red)', fontWeight:600, borderTop:'1px solid var(--border)' }}>
          Выйти из аккаунта
        </button>
        <button onClick={() => {
          if (window.confirm('Вы уверены? Все ваши данные будут безвозвратно удалены.')) {
            api.delete('/api/forwork/profile', { data: { contractor_id: profile?.id } })
              .then(() => {
                localStorage.removeItem('fw_token')
                localStorage.removeItem('fw_contractor')
                localStorage.removeItem('forwork_token')
                window.location.href = '/login'
              })
              .catch(() => alert('Ошибка при удалении аккаунта. Попробуйте позже.'))
          }
        }}
          style={{ width:'100%', padding:'16px 20px', background:'none', border:'none', textAlign:'left', fontSize:14, color:'#9ca3af', fontWeight:500, borderTop:'1px solid var(--border)' }}>
          Удалить аккаунт
        </button>
      </div>
    </div>
  )
}
