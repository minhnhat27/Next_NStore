import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '~/components/common/auth-provider'
import { getUserInfo, hasAuthSession } from '~/lib/auth-service'
import { AntdRegistry } from '@ant-design/nextjs-registry'

import dynamic from 'next/dynamic'
import { App } from 'antd'
import FavoriteProvider from '~/components/common/favorite-provider'
import ChatBox from '~/components/chat/chat-box'
import { GoogleOAuthProvider } from '@react-oauth/google'

const inter = Inter({ subsets: ['vietnamese'] })

const storeName = process.env.NEXT_PUBLIC_STORE_NAME

export const metadata: Metadata = {
  title: storeName,
  description: 'Fashions Store',
}

const AntdStyleProvider = dynamic(() => import('~/components/layout/antd-style-provider'), {
  ssr: false,
})

const Google_Client_ID = process.env.GOOGLE_CLIENT_ID

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
      <head>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        ></script>
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={Google_Client_ID ?? ''}>
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
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
