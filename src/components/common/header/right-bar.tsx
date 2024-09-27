'use client'

import { Badge, Drawer, Dropdown, Flex, Input, MenuProps } from 'antd'
import { FaHeart, FaSearch, FaShoppingBag, FaUser } from 'react-icons/fa'
import useAuth from '~/hooks/useAuth'
import Link from 'next/link'
import { logout } from '~/lib/auth-service'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AuthActions } from '~/utils/auth-actions'
import { UserOutlined } from '@ant-design/icons'

const dropdownItems = (name?: string, handleLogout?: () => void): MenuProps['items'] => [
  {
    key: '/profile',
    label: (
      <Link href="/account/profile">
        <span>
          <UserOutlined /> {name}
        </span>
      </Link>
    ),
  },
  {
    type: 'divider',
  },
  {
    key: '1',
    onClick: handleLogout,
    label: 'Đăng xuất',
  },
]

export default function RightBar() {
  const { state, dispatch } = useAuth()
  const router = useRouter()

  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  const handleLogout = async (): Promise<void> => {
    await logout()
    dispatch(AuthActions.LOGOUT)
    router.push('/login')
  }

  return (
    <>
      <Flex align="center" className="space-x-4 text-xl cursor-pointer select-none">
        <FaSearch
          onClick={() => setShowSearch(!showSearch)}
          className="flex-shrink-0 transition-colors text-slate-400 hover:text-slate-500 "
        />
        {state.isAuthenticated ? (
          <Dropdown
            menu={{ items: dropdownItems(state.userInfo?.fullname, handleLogout) }}
            trigger={['click']}
          >
            <span className="flex-shrink-0 transition-colors text-slate-400 hover:text-slate-500 ">
              <FaUser />
            </span>
          </Dropdown>
        ) : (
          <Link href="/login">
            <span className="flex-shrink-0 transition-colors text-slate-400 hover:text-slate-500 ">
              <FaUser />
            </span>
          </Link>
        )}
        <Link href="/favorites">
          <FaHeart className="text-slate-400 hover:text-slate-500 transition-colors text-xl" />
        </Link>
        <Badge count={0} showZero size="small">
          <Link href="/cart">
            <FaShoppingBag className="text-slate-400 hover:text-slate-500 transition-colors text-xl" />
          </Link>
        </Badge>
      </Flex>
      <Drawer
        title="Tìm kiếm"
        placement="top"
        onClose={() => setShowSearch(false)}
        open={showSearch}
        styles={{ wrapper: { height: 'fit-content' } }}
      >
        <Input.Search
          placeholder="Nhập sản phẩm cần tìm"
          size="large"
          className="w-full"
          value={searchText}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Drawer>
    </>
  )
}
