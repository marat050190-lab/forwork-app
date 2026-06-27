import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('fw_token'))

  const login = (t) => { localStorage.setItem('fw_token', t); setToken(t) }
  const logout = () => { localStorage.removeItem('fw_token'); setToken(null) }

  return (
    <BrowserRouter>
      {token ? (
        <div style={{ paddingBottom: 70 }}>
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/profile" element={<ProfilePage onLogout={logout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <BottomNav />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={login} />} />
          <Route path="/register" element={<RegisterPage onLogin={login} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
