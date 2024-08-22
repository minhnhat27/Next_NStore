'use client'

import { App, Layout } from 'antd'
import { Suspense } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import Loading from '~/app/loading'

const { Content } = Layout

interface IProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export default function AntdLayout({ children, header, footer }: IProps) {
  return (
    <StyleProvider layer hashPriority="low">
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
    </StyleProvider>
  )
}
