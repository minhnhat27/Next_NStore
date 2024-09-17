import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '~/components/common/auth-provider'
import { getUserInfo, hasAuthSession } from '~/lib/auth-service'
import { AntdRegistry } from '@ant-design/nextjs-registry'

const inter = Inter({ subsets: ['vietnamese'] })

export const metadata: Metadata = {
  title: 'VOA Store',
  description: 'Fashions Store',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState: AuthStateType = {
    isAuthenticated: await hasAuthSession(),
    userInfo: await getUserInfo(),
  }

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider initialState={initialState}>
          <AntdRegistry>{children}</AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  )
}
