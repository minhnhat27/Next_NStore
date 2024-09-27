'use client'

import { Suspense, useMemo } from 'react'
import Loading from '~/app/loading'

import { App, ConfigProvider, Layout } from 'antd'
import viVN from 'antd/locale/vi_VN'

const { Content } = Layout

interface IProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export default function MainLayout({ children, header, footer }: IProps) {
  return (
    <ConfigProvider locale={viVN}>
      <Layout className="bg-white">
        {header}
        <Suspense fallback={<Loading />}>
          <Content className="min-h-screen--header lg:container lg:mx-auto transition-all">
            {children}
          </Content>
        </Suspense>
        {footer}
      </Layout>
    </ConfigProvider>
  )
}
