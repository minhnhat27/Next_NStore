'use client'

import { App, ConfigProvider, Layout } from 'antd'
import { Suspense } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import Loading from '~/app/loading'
import viVN from 'antd/locale/vi_VN'

const { Content } = Layout

interface IProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export default function AntdLayout({ children, header, footer }: IProps) {
  return (
    <StyleProvider layer hashPriority="low">
      <ConfigProvider locale={viVN}>
        <App
          notification={{
            showProgress: true,
          }}
        >
          <Layout>
            {header}
            <Suspense fallback={<Loading />}>
              <Content className="min-h-screen--header bg-white">{children}</Content>
            </Suspense>
            {footer}
          </Layout>
        </App>
      </ConfigProvider>
    </StyleProvider>
  )
}
