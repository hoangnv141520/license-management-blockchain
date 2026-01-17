import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSession } from '@/lib/auth/session'
import { ISessionPayload } from '@/types/auth'

const MainLayout = () => {
  const [session, setSession] = useState<ISessionPayload | null>(null)

  useEffect(() => {
    getSession().then(setSession)
  }, [])

  return (
    <main className='flex h-screen flex-col'>
      <Header role={(session?.role as 'admin') ?? null} />
      <div className='flex-1 pt-16'>
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}

export default MainLayout
