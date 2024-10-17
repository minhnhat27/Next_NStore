'use client'

import { Suspense, useEffect } from 'react'
import Loading from '~/app/loading'

import { App, ConfigProvider, FloatButton, Layout } from 'antd'
import viVN from 'antd/locale/vi_VN'
import useFavorite from '~/hooks/useFavorites'
import useSWRImmutable from 'swr/immutable'
import { ACCOUNT_API } from '~/utils/api-urls'
import httpService from '~/lib/http-service'
import useAuth from '~/hooks/useAuth'

const { Content } = Layout

interface IProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export default function MainLayout({ children, header, footer }: IProps) {
  const { setFavorite } = useFavorite()
  const { state } = useAuth()
  const session = state.userInfo?.session

  const { data } = useSWRImmutable<number[]>(
    state.isAuthenticated && [ACCOUNT_API + '/favorite', session],
    ([url, session]) => httpService.getWithSession(url, session),
  )

  useEffect(() => {
    if (data) setFavorite(data)
  }, [data])

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
      <FloatButton.BackTop style={{ insetInlineEnd: 90 }} className="h-12 w-12" />
    </ConfigProvider>
  )
}
