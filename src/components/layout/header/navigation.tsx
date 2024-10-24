'use client'

import { Button, ConfigProvider, Drawer, Flex, Menu, MenuProps } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import Image from 'next/image'

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
        key: '/fashions/men',
        label: <Link href="/fashions/men">Thời trang nam</Link>,
      },
      {
        key: '/fashions/women',
        label: <Link href="/fashions/women">Thời Trang nữ</Link>,
      },
      {
        key: '/fashions/unisex',
        label: <Link href="/fashions/unisex">Unisex</Link>,
      },
    ],
  },
  { key: '/sales', label: <Link href="/sales">SALE CỰC NÓNG</Link> },
  { key: '/new', label: <Link href="/new">MỚI</Link> },
]

export default function Navigation() {
  const pathname = usePathname()
  const [showNavbar, setShowNavbar] = useState(false)

  return (
    <>
      <Flex align="center" className="shrink-0">
        <Button type="text" className="md:hidden p-0" onClick={() => setShowNavbar(!showNavbar)}>
          <MenuUnfoldOutlined className="text-white text-xl" />
        </Button>
        <Link href="/" className="flex items-center">
          <Image
            priority
            alt="logo"
            src="/images/Logo-1x1.png"
            width={0}
            height={0}
            sizes="100vw"
            quality={100}
            className="w-24 h-auto"
          />
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
          className="text-nowrap text-lg bg-transparent hidden md:inline-block text-center w-full"
          items={navigateItems}
          mode="horizontal"
          selectedKeys={[pathname]}
          theme="dark"
        />
      </ConfigProvider>

      <Drawer title="Menu" placement="left" onClose={() => setShowNavbar(false)} open={showNavbar}>
        <Menu
          mode="inline"
          items={navigateItems}
          selectedKeys={[pathname]}
          onSelect={() => setShowNavbar(false)}
          className="font-semibold h-full"
        />
      </Drawer>
    </>
  )
}
