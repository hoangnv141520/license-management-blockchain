import Footer from '@/components/common/footer'
import Header from '@/components/common/header'
import { Sidebar } from '@/components/common/sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <main className='flex h-screen flex-col bg-background'>
      <Header role='admin' />
      <div className='flex flex-1 pt-16'>
        {/* Sidebar for Desktop */}
        <aside className='hidden md:block fixed left-0 top-16 bottom-0 w-64 z-30'>
          <Sidebar />
        </aside>
        
        {/* Main Content */}
        <div className='flex-1 md:pl-64 flex flex-col min-h-0'>
          <div className='flex-1 container py-6 overflow-y-auto'>
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default AdminLayout