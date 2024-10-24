import { ConfigProvider, Layout } from 'antd'
import { Suspense } from 'react'
import Footer from '~/components/layout/footer'
import Header from '~/components/layout/header'
import Loading from './loading'

import viVN from 'antd/locale/vi_VN'
import BackTop from '~/components/ui/back-top'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConfigProvider locale={viVN}>
      <Layout className="bg-white">
        <Header />
        <Suspense fallback={<Loading />}>
          <div className="min-h-screen--header lg:container lg:mx-auto transition-all">
            {children}
          </div>
        </Suspense>
        <Footer />
        <BackTop />
      </Layout>
    </ConfigProvider>
  )
}
