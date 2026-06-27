import { useState, useEffect } from 'react'
import api from '../api.js'

const STATUS = { new:'Новая', pay_executor:'В работе', done:'Выполнена', cancelled:'Отменена' }
const STATUS_COLOR = { new:'var(--orange)', pay_executor:'var(--green)', done:'var(--gray)', cancelled:'var(--red)' }

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [taking, setTaking] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/api/forwork/orders'); setOrders(r.data) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const take = async (id) => {
    setTaking(id)
    try { await api.post(`/api/forwork/orders/${id}/take`); load() } catch(e) { alert(e.response?.data?.error || 'Ошибка') }
    setTaking(null)
  }

  return (
    <div style={{ padding:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.5px' }}>Доступные заказы</div>
        <button onClick={load} style={{ background:'none', border:'none', color:'var(--orange)', fontWeight:600, fontSize:14 }}>Обновить</button>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--gray)' }}>Загрузка...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--gray)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
          <div style={{ fontWeight:600, fontSize:16 }}>Нет доступных заказов</div>
          <div style={{ fontSize:14, marginTop:8 }}>Новые заказы появятся здесь</div>
        </div>
      ) : orders.map(o => (
        <div key={o.id} style={{ background:'#fff', borderRadius:16, padding:18, marginBottom:12, boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--orange)' }}>#{o.id}</div>
            <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, background: STATUS_COLOR[o.status] + '20', color: STATUS_COLOR[o.status] }}>
              {STATUS[o.status] || o.status}
            </span>
          </div>

          {o.service_type && <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>{o.service_type}</div>}
          {o.address && <div style={{ fontSize:14, color:'var(--gray)', marginBottom:6 }}>📍 {o.address}</div>}
          {o.work_date && <div style={{ fontSize:14, color:'var(--gray)', marginBottom:6 }}>📅 {new Date(o.work_date).toLocaleDateString('ru-RU')}</div>}
          {o.client_name && <div style={{ fontSize:14, color:'var(--gray)', marginBottom:12 }}>👤 {o.client_name}</div>}

          {o.executor_cost > 0 && (
            <div style={{ fontSize:20, fontWeight:800, color:'var(--dark)', marginBottom:14 }}>
              {Number(o.executor_cost).toLocaleString('ru')} ₽
            </div>
          )}

          <button onClick={() => take(o.id)} disabled={taking === o.id}
            style={{ width:'100%', padding:'13px', background:'var(--orange)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, boxShadow:'0 3px 12px rgba(255,140,0,0.3)' }}>
            {taking === o.id ? 'Беру...' : 'Взять заказ'}
          </button>
        </div>
      ))}
    </div>
  )
}
