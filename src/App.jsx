import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './routes/ProtectedRoutes'
import DashboardPage from './pages/DashboardPage'
import TransactionDetailPage from './pages/TransactionDetailPage'
import TransactionsPage from './pages/TransactionsPage'

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#040508] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-brand/10 blur-[100px] pointer-events-none"></div>
      
      {/* Simulated Mobile Device Frame */}
      <div className="relative w-full h-screen sm:max-w-[420px] sm:h-[840px] sm:rounded-[32px] sm:border-4 sm:border-dark-border sm:shadow-[0_24px_50px_-12px_rgba(46,91,255,0.15)] bg-dark-bg flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Device Speaker/Notch (Desktop only) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-dark-border rounded-b-2xl z-50">
          <div className="w-12 h-1 bg-dark-bg mx-auto mt-1.5 rounded-full"></div>
        </div>

        {/* Screen Content Window */}
        <div className="flex-1 overflow-y-auto no-scrollbar w-full h-full flex flex-col sm:pt-4">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
              <Route path="/transactions/:reference_code" element={<ProtectedRoute><TransactionDetailPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  )
}