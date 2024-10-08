'use client'

import { Badge, Dropdown, Flex, Input, MenuProps } from 'antd'
import { FaShoppingBag, FaUser } from 'react-icons/fa'
import useAuth from '~/hooks/useAuth'
import Link from 'next/link'
import { logout } from '~/lib/auth-service'
import { useRouter } from 'next/navigation'
import { AuthActions } from '~/utils/auth-actions'
import { UserOutlined } from '@ant-design/icons'
import useSWRImmutable from 'swr/immutable'
import { CART_API } from '~/utils/api-urls'
import httpService from '~/lib/http-service'
import Search from './search'

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
  const session = state.userInfo?.session
  const isAuthenticated = state.isAuthenticated
  const router = useRouter()

  const { data } = useSWRImmutable<number>(
    isAuthenticated && [CART_API + '/count', session],
    ([url, session]) => httpService.getWithSession(url, session),
  )

  const handleLogout = async (): Promise<void> => {
    await logout()
    dispatch(AuthActions.LOGOUT)
    router.push('/login')
  }

  return (
    <>
      <Flex align="center" className="space-x-4 text-xl cursor-pointer select-none">
        <Search />
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
        <Badge count={data ?? 0} size="small">
          <Link href="/cart">
            <FaShoppingBag className="text-slate-400 hover:text-slate-500 transition-colors text-xl" />
          </Link>
        </Badge>
      </Flex>
    </>
  )
}
