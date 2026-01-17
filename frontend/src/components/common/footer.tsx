import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className='dark:bg-background w-full border-gray-500 bg-gray-100 py-8 pt-8 dark:border-t'>
      <div className='container space-y-4'>
        <div className='flex items-center gap-2 lg:justify-start'>
          <Link to='/'>
            <h2 className='text-main font-semibold text-2xl'>HyperFabric</h2>
          </Link>
        </div>
        <p className='text-muted-foreground text-sm'>Giải pháp quản lý doanh nghiệp ứng dụng Blockchain.</p>
        <div className='flex flex-col justify-between gap-4 md:flex-row'>
          <p className='text-muted-foreground text-sm'>© 2026 HyperFabric.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
