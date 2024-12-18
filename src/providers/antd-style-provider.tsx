'use client'

import { StyleProvider } from '@ant-design/cssinjs'

export default function AntdStyleProvider({ children }: IProps) {
  return <StyleProvider layer>{children}</StyleProvider>
}
