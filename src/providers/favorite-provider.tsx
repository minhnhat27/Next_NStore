'use client'

import { App } from 'antd'
import { createContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import useAuth from '~/hooks/useAuth'
import httpService from '~/lib/http-service'
import { ACCOUNT_API } from '~/utils/api-urls'

interface IProps {
  children: React.ReactNode
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export default function FavoriteProvider({ children }: IProps) {
  const [favorites, setFavorites] = useState<number[]>([])
  const { message } = App.useApp()

  const { state } = useAuth()
  const session = state.userInfo?.session

  const { data } = useSWR<number[]>(
    state.isAuthenticated && [ACCOUNT_API + '/favorite', session],
    ([url, session]) => httpService.getWithSession(url, session),
  )

  useEffect(() => {
    if (data) setFavorites(data)
  }, [data])

  const addFavorite = async (productId: number): Promise<void> => {
    const data = { id: productId }
    await httpService.post(ACCOUNT_API + '/favorite', data)
    message.success('Đã thêm vào yêu thích')
    setFavorites((pre) => [...pre, productId])
  }

  const removeFavorite = async (productId: number): Promise<void> => {
    await httpService.del(ACCOUNT_API + `/favorite/${productId}`)
    message.info('Đã xóa khỏi yêu thích')
    setFavorites((pre) => pre.filter((id) => id !== productId))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
