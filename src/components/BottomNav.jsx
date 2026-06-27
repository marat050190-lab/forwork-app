import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Заказы', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { to: '/my-orders', label: 'Мои', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { to: '/profile', label: 'Профиль', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function BottomNav() {
  return (
    <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, background:'#fff', borderTop:'1px solid #E2E8F0', display:'flex', zIndex:100, paddingBottom:'env(safe-area-inset-bottom)' }}>
      {tabs.map(tab => (
        <NavLink key={tab.to} to={tab.to} end style={({ isActive }) => ({
          flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'10px 0 8px', textDecoration:'none', gap:4,
          color: isActive ? 'var(--orange)' : 'var(--gray)',
          fontSize: 11, fontWeight: isActive ? 700 : 400,
        })}>
          {tab.icon}
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
