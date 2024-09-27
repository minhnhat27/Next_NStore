import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '~/components/common/auth-provider'
import { getUserInfo, hasAuthSession } from '~/lib/auth-service'
import { AntdRegistry } from '@ant-design/nextjs-registry'

import dynamic from 'next/dynamic'
import { App } from 'antd'

const inter = Inter({ subsets: ['vietnamese'] })

export const metadata: Metadata = {
  title: 'VOA Store',
  description: 'Fashions Store',
}

const AntdStyleProvider = dynamic(() => import('~/components/layout/antd-style-provider'))

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const auth = hasAuthSession()
  const info = getUserInfo()
  const [isAuthenticated, userInfo] = await Promise.all([auth, info])

  const initialState: AuthStateType = {
    isAuthenticated: isAuthenticated,
    userInfo: userInfo,
  }

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider initialState={initialState}>
          <AntdRegistry>
            <AntdStyleProvider>
              <App>{children}</App>
            </AntdStyleProvider>
          </AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  )
}
