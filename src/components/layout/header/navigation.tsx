'use client'

import { Button, Drawer, Menu, MenuProps } from 'antd'
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
  { key: '/about', label: <Link href="/about">GIỚI THIỆU</Link> },
  { key: '/contact', label: <Link href="/contact">LIÊN HỆ</Link> },
]

export default function Navigation() {
  const pathname = usePathname()
  const [showNavbar, setShowNavbar] = useState(false)

  return (
    <>
      <div className="flex items-center shrink-0">
        <Button
          type="text"
          className="md:hidden p-0 mx-1"
          onClick={() => setShowNavbar(!showNavbar)}
        >
          <MenuUnfoldOutlined className="text-gray-700 text-xl" />
        </Button>
        <Link href="/" className="flex items-center">
          <Image
            priority
            alt="logo"
            src="/images/Logo-Text-White-1x1.png"
            blurDataURL="/images/Logo-White-1x1.png"
            width={0}
            height={0}
            sizes="100vw"
            quality={100}
            className="w-24 h-auto max-h-24"
          />
        </Link>
      </div>
      {/* <ConfigProvider
        theme={{
          components: {
            Menu: {
              darkItemSelectedBg: 'tranparent',
            },
          },
        }}
      > */}
      <Menu
        className="text-nowrap text-lg bg-transparent hidden md:inline-block text-center w-full"
        items={navigateItems}
        mode="horizontal"
        selectedKeys={[pathname]}
        // theme="dark"
      />
      {/* </ConfigProvider> */}

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
