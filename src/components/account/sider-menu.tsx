'use client'

import { AppstoreOutlined, CalendarOutlined, MailOutlined } from '@ant-design/icons'
import { GetProp, Layout, Menu, MenuProps } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const { Sider } = Layout

type MenuItem = GetProp<MenuProps, 'items'>[number]
const items: MenuItem[] = [
  {
    key: '/account/profile',
    icon: <MailOutlined />,
    label: <Link href="/account/profile">Thông tin cá nhân</Link>,
  },
  {
    key: '/account/purchase',
    icon: <CalendarOutlined />,
    label: <Link href="/account/purchase">Đơn hàng</Link>,
  },
  {
    key: '/account/address',
    icon: <AppstoreOutlined />,
    label: <Link href="/account/address">Địa chỉ</Link>,
  },
]

export default function SiderMenu() {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const pathname = usePathname()

  return (
    <>
      <Sider
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        onBreakpoint={() => setCollapsed(false)}
        className="h-fit w-full"
        breakpoint="md"
        theme="light"
      >
        <Menu selectedKeys={[pathname]} mode="inline" items={items} />
      </Sider>
    </>
  )
}
