import { Card, Flex } from 'antd'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập | Đăng ký',
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      justify="center"
      align="center"
      className="min-h-screen--header py-8 transition-all duration-300 bg-gradient-to-br from-slate-100 to-gray-100"
    >
      <Card className="drop-shadow transition-all w-11/12 md:w-3/5 lg:w-2/5">{children}</Card>
    </Flex>
  )
}
