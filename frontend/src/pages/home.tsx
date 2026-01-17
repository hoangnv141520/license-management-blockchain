import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Building2, FileText, ScrollText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSession } from '@/lib/auth/session'

const GuestHome = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                 <span className="text-4xl font-bold tracking-tighter sm:text-5xl text-main">HyperFabric</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Quản lý Doanh nghiệp & Cấp phép
                <br />
                <span className="text-main">Minh bạch trên Blockchain</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Hệ thống quản lý toàn diện hồ sơ, cấp phép kinh doanh và xác thực giấy tờ điện tử sử dụng công nghệ Blockchain tiên tiến.
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/auth/sign-in">
                <Button size="lg" className="h-11 px-8 gap-2">
                  Bắt đầu ngay <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button variant="outline" size="lg" className="h-11 px-8">
                  Đăng ký doanh nghiệp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold">Bảo mật tuyệt đối</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Dữ liệu giấy phép được lưu trữ trên Blockchain, đảm bảo tính toàn vẹn và không thể làm giả.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold">Xử lý nhanh chóng</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Quy trình nộp hồ sơ, thẩm định và cấp phép được số hóa toàn trình, rút ngắn thời gian chờ đợi.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
                <CheckCircle2 className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-bold">Dễ dàng tra cứu</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Công cụ tra cứu và xác thực giấy phép trực tuyến giúp đối tác và cơ quan chức năng kiểm tra dễ dàng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const UserHome = () => {
  return (
    <div className="container py-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Dưới đây là các chức năng quản lý chính của hệ thống.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/business-management">
          <div className="h-full p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer space-y-4 group">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">Quản lý Doanh nghiệp</h3>
              <p className="text-sm text-muted-foreground">
                Xem danh sách, cập nhật thông tin và quản lý hồ sơ doanh nghiệp.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/admin/dossier-management">
          <div className="h-full p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer space-y-4 group">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">Quản lý Hồ sơ</h3>
              <p className="text-sm text-muted-foreground">
                Theo dõi tiến độ, xử lý hồ sơ đăng ký và bổ sung tài liệu.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/admin/license-management">
          <div className="h-full p-6 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer space-y-4 group">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform">
                <ScrollText className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">Quản lý Giấy phép</h3>
              <p className="text-sm text-muted-foreground">
                Cấp mới, gia hạn và thu hồi giấy phép kinh doanh trên Blockchain.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-muted/20">
           <h3 className="font-semibold mb-2">Trạng thái hệ thống Blockchain</h3>
           <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Đang hoạt động ổn định
           </div>
        </div>
         <div className="p-6 border rounded-xl bg-muted/20">
           <h3 className="font-semibold mb-2">Thống kê nhanh</h3>
           <div className="text-sm text-muted-foreground">
              Hiện đang có <span className="font-bold text-foreground">0</span> hồ sơ đang chờ xử lý.
           </div>
        </div>
      </div>
    </div>
  )
}

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    getSession().then((session) => {
      setIsAuthenticated(!!session?.accessToken)
    })
  }, [])

  if (isAuthenticated === null) {
    return null // Or a loading spinner
  }

  return isAuthenticated ? <UserHome /> : <GuestHome />
}

export default HomePage