'use client'

import { App, Flex, Layout } from 'antd'
import RightBar from './right-bar'
import React, { Suspense } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import Navigation from './navigation'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Loading from '~/app/loading'

const { Header, Footer, Content } = Layout

export default function RootAntLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <StyleProvider layer hashPriority="low">
        <App
          notification={{
            showProgress: true,
          }}
        >
          <Layout>
            <Header className="h-24 z-20 px-6 md:px-10 bg-black sticky top-0">
              <Flex align="center" justify="space-between">
                <Navigation />
                <RightBar />
              </Flex>
            </Header>
            <Suspense fallback={<Loading />}>
              <Content className="min-h-screen--header bg-white">{children}</Content>
            </Suspense>
            <Footer className="bg-black text-white flex items-center">Footer</Footer>
          </Layout>
        </App>
      </StyleProvider>
    </AntdRegistry>
  )
}
