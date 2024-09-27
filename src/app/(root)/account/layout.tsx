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
      <Layout className="bg-white">
        <SiderMenu />
        <Layout className="bg-white">
          <div className="bg-gray-100 min-h-[70vh] h-fit p-4">{children}</div>
        </Layout>
      </Layout>
    </div>
  )
}
