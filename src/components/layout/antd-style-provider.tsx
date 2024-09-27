'use client'

import { StyleProvider } from '@ant-design/cssinjs'
import { App } from 'antd'

export default function AntdStyleProvider({ children }: { children: React.ReactNode }) {
  return <StyleProvider layer>{children}</StyleProvider>
}
