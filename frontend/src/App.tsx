import { ThemeProvider } from '@/components/providers/theme-provider'
import SwrProvider from '@/components/providers/swr-provider'
import { Toaster } from 'sonner'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/home'
import SignInPage from './pages/auth/sign-in'
import SignUpPage from './pages/auth/sign-up'
import AdminLayout from './layouts/admin-layout'
import BusinessManagementPage from './pages/admin/business-management'
import BusinessDetailPage from './pages/admin/business-management/detail'
import DossierManagementPage from './pages/admin/dossier-management'
import DossierDetailPage from './pages/admin/dossier-management/detail'
import LicenseManagementPage from './pages/admin/license-management'
import LicenseDetailPage from './pages/admin/license-management/detail'
import { useEffect, useState } from 'react'
import { getSession } from './lib/auth/session'

import MainLayout from './layouts/main-layout'

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    getSession().then((session) => {
      setIsAuthenticated(!!session?.accessToken)
    })
  }, [])

  if (isAuthenticated === null) return null // Loading state

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <SwrProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            
            {/* Auth Pages (Standalone) */}
            <Route path="/auth/sign-in" element={<SignInPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            
            {/* Admin Routes wrapped in AdminLayout */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="business-management" replace />} />
              <Route path="business-management" element={<BusinessManagementPage />} />
              <Route path="business-management/:slug" element={<BusinessDetailPage />} />
              <Route path="dossier-management" element={<DossierManagementPage />} />
              <Route path="dossier-management/:slug" element={<DossierDetailPage />} />
              <Route path="license-management" element={<LicenseManagementPage />} />
              <Route path="license-management/:slug" element={<LicenseDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster expand={true} />
      </SwrProvider>
    </ThemeProvider>
  )
}

export default App