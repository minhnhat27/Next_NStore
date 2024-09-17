'use client'

import { Button, ConfigProvider, Drawer, Flex, Image, Menu, MenuProps } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MenuUnfoldOutlined } from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number]

const navigateItems: MenuItem[] = [
  {
    key: '/',
    label: <Link href="/">TRANG CHỦ</Link>,
  },
  {
    key: '/fashions-1',
    label: 'THỜI TRANG',
    theme: 'light',
    children: [
      { key: '/fashions', label: <Link href="/fashions">Tất cả</Link>, theme: 'dark' },
      {
        key: '/men-fashions',
        label: <Link href="/men-fashions">Thời trang nam</Link>,
      },
      {
        key: '/women-fashions',
        label: <Link href="/women-fashions">Thời Trang nữ</Link>,
      },
      {
        key: '/unisex-fashions',
        label: <Link href="/unisex-fashions">Unisex</Link>,
      },
    ],
  },
  { key: '/sales', label: <Link href="/sales">SALE CỰC NÓNG</Link> },
  { key: '/new', label: <Link href="/new">MỚI</Link> },
]

export default function Navigation() {
  const pathname = usePathname()
  const [showNavbar, setShowNavbar] = useState(false)

  const regex = pathname.match(/^\/[^/]+/)?.at(0) ?? '/'
  return (
    <>
      <Flex align="center" className="shrink-0">
        <Button type="text" className="md:hidden p-0" onClick={() => setShowNavbar(!showNavbar)}>
          <MenuUnfoldOutlined className="text-white text-xl" />
        </Button>
        <Link href="/" className="flex items-center">
          <Image alt="logo" src="/images/Logo-1x1.png" className="w-24" preview={false} />
        </Link>
      </Flex>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              darkItemSelectedBg: 'tranparent',
            },
          },
        }}
      >
        <Menu
          className="text-nowrap text-lg bg-black hidden md:inline-block text-center w-full"
          items={navigateItems}
          mode="horizontal"
          selectedKeys={[regex]}
          theme="dark"
        />
      </ConfigProvider>
      <Drawer title="Menu" placement="left" onClose={() => setShowNavbar(false)} open={showNavbar}>
        <Menu
          mode="inline"
          items={navigateItems}
          selectedKeys={[regex]}
          onSelect={() => setShowNavbar(false)}
          className="font-semibold"
        />
      </Drawer>
    </>
  )
}
