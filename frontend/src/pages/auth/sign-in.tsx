import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import z from 'zod'

const background = '/assets/images/background.jpg'
import { validateEmail, validatePassword } from '@/lib/utils/validators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from '@/lib/auth/auth'
import { showNotification } from '@/lib/utils/common'
import CustomField from '@/components/common/custom-field'
import { LogInIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  email: validateEmail,
  password: validatePassword
})

export default function SignInPage() {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await signIn(data)
    if (res === false) {
      showNotification('error', 'Email hoặc mật khẩu không chính xác')
    } else {
      showNotification('success', 'Đăng nhập thành công')
      navigate('/')
    }
  }

  return (
    <div className='relative top-0 right-0 bottom-0 left-0 h-screen'>
      <img src={background} width={1500} height={1500} className='h-full w-full object-cover' alt='no-image' />
      <Dialog open>
        <DialogContent className='rounded-lg sm:max-w-[450px] [&>button]:hidden'>
          <DialogHeader>
            <DialogTitle>
              <span
                className='flex cursor-pointer items-center justify-center gap-2'
                onClick={() => {
                  navigate('/')
                }}
              >
                <span className='text-main text-xl font-semibold md:text-2xl'>HyperFabric</span>
              </span>
            </DialogTitle>
            <div className='text-center'>
              <span className='text-xl font-semibold md:text-2xl'>Đăng nhập</span>
              <DialogDescription>Chào mừng bạn quay trở lại</DialogDescription>
            </div>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <CustomField
              type='input'
              control={form.control}
              name='email'
              label='Email'
              placeholder='Nhập email'
              setting={{ input: { type: 'email' } }}
              required
            />
            <CustomField
              type='password'
              control={form.control}
              name='password'
              label='Mật khẩu'
              placeholder='Nhập mật khẩu'
              required
            />
            <Button type='submit' className='w-full' isLoading={form.formState.isSubmitting}>
              <LogInIcon /> Đăng nhập
            </Button>
          </form>
          <div className='relative'>
            <hr className='my-4' />
            <span className='absolute top-1 left-1/2 -translate-x-1/2 text-sm text-gray-500'>
              <div className='dark:bg-background bg-white px-2 text-sm'>hoặc</div>
            </span>
          </div>
          <p className='text-center text-sm'>
            Bạn chưa có tài khoản?{' '}
            <span className='cursor-pointer underline' onClick={() => navigate('/auth/sign-up')}>
              Đăng ký
            </span>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
