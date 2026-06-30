import { useState, useEffect } from 'react'
import api from '../api.js'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/api/forwork/my-orders'); setOrders(r.data) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const complete = async (id) => {
    if (!confirm('Отметить заказ как выполненный?')) return
    setCompleting(id)
    try { await api.post(`/api/forwork/orders/${id}/complete`); load() } catch(e) { alert('Ошибка') }
    setCompleting(null)
  }

  const total = orders.filter(o => o.status === 'done').reduce((s,o) => s + Number(o.executor_cost || 0), 0)

  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.5px', marginBottom:8 }}>Мои заказы</div>

      {total > 0 && (
        <div style={{ background:'linear-gradient(135deg, var(--orange), #00993F)', borderRadius:16, padding:18, marginBottom:20, color:'#fff' }}>
          <div style={{ fontSize:12, fontWeight:700, opacity:0.8, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Заработано всего</div>
          <div style={{ fontSize:28, fontWeight:800 }}>{total.toLocaleString('ru')} ₽</div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--gray)' }}>Загрузка...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--gray)' }}>
          <div style={{ fontWeight:600, fontSize:16 }}>Заказов пока нет</div>
          <div style={{ fontSize:14, marginTop:8 }}>Возьмите первый заказ</div>
        </div>
      ) : orders.map(o => (
        <div key={o.id} style={{ background:'#fff', borderRadius:16, padding:18, marginBottom:12, boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--orange)' }}>#{o.id}</div>
            <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20,
              background: o.status === 'done' ? '#E6F9EE' : o.status === 'pay_executor' ? '#FEF3C7' : '#FFF3E0',
              color: o.status === 'done' ? 'var(--green)' : o.status === 'pay_executor' ? '#92400E' : 'var(--orange)' }}>
              {o.status === 'done' ? 'Выполнен' : o.status === 'pay_executor' ? 'Ожидает оплаты' : 'В работе'}
            </span>
          </div>
          {o.service_type && <div style={{ fontWeight:600, marginBottom:6 }}>{o.service_type}</div>}
          {o.address && <div style={{ fontSize:14, color:'var(--gray)', marginBottom:4 }}>📍 {o.address}</div>}
          {o.work_date && <div style={{ fontSize:14, color:'var(--gray)', marginBottom:10 }}>📅 {new Date(o.work_date).toLocaleDateString('ru-RU')}</div>}
          {o.executor_cost > 0 && <div style={{ fontSize:18, fontWeight:800, marginBottom: o.status !== 'done' ? 14 : 0 }}>{Number(o.executor_cost).toLocaleString('ru')} ₽</div>}
          {o.status === 'in_progress' && (
            <button onClick={() => complete(o.id)} disabled={completing === o.id}
              style={{ width:'100%', padding:'12px', background:'var(--green)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:700 }}>
              {completing === o.id ? '...' : 'Отметить выполненным'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
