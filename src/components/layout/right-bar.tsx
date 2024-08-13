import { Badge, Drawer, Dropdown, Flex, Input, MenuProps, Tooltip } from 'antd'
import { FaHeart, FaSearch, FaShoppingBag, FaUser } from 'react-icons/fa'
import { useAuth } from '../auth-provider'
import Link from 'next/link'
import { AuthActions } from '~/utils/types'
import { logout } from '~/lib/auth-session'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const dropdownItems = (handleLogout?: () => void): MenuProps['items'] => [
  {
    key: '/profile',
    label: <Link href="/profile">Trang cá nhân</Link>,
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

const RightBar: React.FC = () => {
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
          <Dropdown menu={{ items: dropdownItems(handleLogout) }}>
            <span className="flex-shrink-0 transition-colors text-slate-400 hover:text-slate-500 ">
              <FaUser />
            </span>
          </Dropdown>
        ) : (
          <Tooltip title="Đăng nhập" color="cyan">
            <Link href="login">
              <span className="flex-shrink-0 transition-colors text-slate-400 hover:text-slate-500 ">
                <FaUser />
              </span>
            </Link>
          </Tooltip>
        )}
        <Link href="favorites">
          <FaHeart className="text-slate-400 hover:text-slate-500 transition-colors text-xl" />
        </Link>
        <Badge count={0} showZero size="small">
          <Link href="cart">
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
export default RightBar
