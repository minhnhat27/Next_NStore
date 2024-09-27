import Footer from '~/components/common/footer'
import Header from '~/components/common/header'
import MainLayout from '~/components/layout/main-layout'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MainLayout header={<Header />} footer={<Footer />}>
      {children}
    </MainLayout>
  )
}
