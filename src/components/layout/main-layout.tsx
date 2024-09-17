'use client'

import { Layout } from 'antd'
import { Suspense } from 'react'
import Loading from '~/app/loading'
import WapperLayout from './wapper'

const { Content } = Layout

interface IProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export default function MainLayout({ children, header, footer }: IProps) {
  return (
    <WapperLayout>
      {header}
      <Suspense fallback={<Loading />}>
        <Content className="min-h-screen--header lg:container lg:mx-auto transition-all">
          {children}
        </Content>
      </Suspense>
      {footer}
    </WapperLayout>
  )
}
