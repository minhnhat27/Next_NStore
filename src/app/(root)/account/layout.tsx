import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import SiderMenu from '~/components/account/sider-menu'
import BreadcrumbLink from '~/components/ui/breadcrumb'

const breadcrumbItems = [
  {
    path: '/',
    title: <HomeOutlined />,
  },
  {
    path: 'profile',
    title: (
      <>
        <UserOutlined />
        <span className="ml-1">Hồ sơ của tôi</span>
      </>
    ),
  },
]

export default async function Profile({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink items={breadcrumbItems} />
      <Layout className="bg-white space-x-4">
        <SiderMenu />
        <Layout className="bg-white border rounded-lg drop-shadow min-h-[calc(100vh-10rem)] h-fit p-4">
          {children}
        </Layout>
      </Layout>
    </div>
  )
}
