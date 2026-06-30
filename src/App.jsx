import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('fw_token') || localStorage.getItem('forwork_token'))
  const [contractor, setContractor] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fw_contractor') || 'null') } catch { return null }
  })

  const login = (t, c) => {
    localStorage.setItem('fw_token', t)
    localStorage.removeItem('forwork_token')
    if (c) localStorage.setItem('fw_contractor', JSON.stringify(c))
    setToken(t)
    setContractor(c || null)
  }
  const logout = () => {
    localStorage.removeItem('fw_token')
    localStorage.removeItem('fw_contractor')
    setToken(null)
    setContractor(null)
  }

  const isRegistered = contractor && contractor.first_name && contractor.city

  return (
    <BrowserRouter>
      {token ? (
        isRegistered ? (
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
            <Route path="/register" element={<RegisterPage onLogin={login} token={token} contractor={contractor} />} />
            <Route path="*" element={<Navigate to="/register" />} />
          </Routes>
        )
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
