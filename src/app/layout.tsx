import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import AntdLayout from '~/components/layout/antd-layout'
import AuthProvider from '~/components/auth-provider'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Flex } from 'antd'
import Navigation from '~/components/layout/navigation'
import RightBar from '~/components/layout/right-bar'
import { Footer, Header } from 'antd/es/layout/layout'
import { getUserInfo, hasAuthSession } from '~/lib/auth-service'

const inter = Inter({ subsets: ['vietnamese'] })

export const metadata: Metadata = {
  title: 'VOA Store',
  description: 'Fashions Store',
}

const header = (
  <Header className="h-24 z-20 px-6 md:px-10 bg-black sticky top-0">
    <Flex align="center" justify="space-between">
      <Navigation />
      <RightBar />
    </Flex>
  </Header>
)
const footer = <Footer className="bg-black text-white flex items-center">Footer</Footer>

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
          <AntdRegistry>
            <AntdLayout header={header} footer={footer}>
              {children}
            </AntdLayout>
          </AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  )
}
