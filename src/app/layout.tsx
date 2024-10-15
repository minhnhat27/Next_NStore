import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '~/components/common/auth-provider'
import { getUserInfo, hasAuthSession } from '~/lib/auth-service'
import { AntdRegistry } from '@ant-design/nextjs-registry'

import dynamic from 'next/dynamic'
import { App } from 'antd'
import Loading from './loading'
import FavoriteProvider from '~/components/common/favorite-provider'
import ChatBox from '~/components/chat/chat-box'

const inter = Inter({ subsets: ['vietnamese'] })

const storeName = process.env.NEXT_PUBLIC_STORE_NAME

export const metadata: Metadata = {
  title: storeName,
  description: 'Fashions Store',
}

const AntdStyleProvider = dynamic(() => import('~/components/layout/antd-style-provider'), {
  ssr: false,
})

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
          <FavoriteProvider>
            <AntdRegistry>
              <AntdStyleProvider>
                <App>
                  {children}
                  <ChatBox />
                </App>
              </AntdStyleProvider>
            </AntdRegistry>
          </FavoriteProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
