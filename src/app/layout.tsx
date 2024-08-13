import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RootAntLayout from '~/components/layout/root-ant-layout'
import AuthProvider from '~/components/auth-provider'
import { AuthStateType } from '~/utils/types'
import { getSession } from '~/lib/auth-session'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NStore',
  description: 'Fashions Store',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState: AuthStateType = {
    isAuthenticated: (await getSession()) !== null,
  }

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider initialState={initialState}>
          <RootAntLayout>{children}</RootAntLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
