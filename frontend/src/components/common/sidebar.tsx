import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils/common'
import { Button } from '@/components/ui/button'
import {
  Building2,
  FileText,
  ScrollText,
  LogOut,
  Settings
} from 'lucide-react'
import { useState } from 'react'
import SignoutDialog from './signout-dialog'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const [openSignout, setOpenSignout] = useState(false)

  const menuItems = [
    {
      title: 'Quản lý doanh nghiệp',
      href: '/admin/business-management',
      icon: Building2
    },
    {
      title: 'Quản lý hồ sơ',
      href: '/admin/dossier-management',
      icon: FileText
    },
    {
      title: 'Quản lý giấy phép',
      href: '/admin/license-management',
      icon: ScrollText
    }
  ]

  return (
    <div className={cn("pb-12 min-h-screen bg-card border-r w-64 flex flex-col justify-between", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-main">
            Admin Panel
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link to={item.href} key={item.href}>
                <Button
                  variant={location.pathname.startsWith(item.href) ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-3 py-2 space-y-1">
         <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
         </Button>
         <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setOpenSignout(true)}
         >
            <LogOut className="h-4 w-4" />
            Đăng xuất
         </Button>
      </div>

      <SignoutDialog open={openSignout} onOpenChange={setOpenSignout} />
    </div>
  )
}
