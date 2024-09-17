'use client'

import { App, ConfigProvider, Layout } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import viVN from 'antd/locale/vi_VN'

export default function WapperLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={viVN}>
        <App
          notification={{
            showProgress: true,
          }}
        >
          <Layout className="bg-white">{children}</Layout>
        </App>
      </ConfigProvider>
    </StyleProvider>
  )
}
