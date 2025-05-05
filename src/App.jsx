import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboardpage'
import EntryPage from './pages/EntryPage'
import InvoiceDetailspage from './pages/InvoiceDetailspage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/entry' element={<EntryPage />} />
      <Route path='/invoice' element={<InvoiceDetailspage />} />
    </Routes>
  )
}
