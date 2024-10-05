'use client'

import { createContext, useState } from 'react'
import httpService from '~/lib/http-service'
import { ACCOUNT_API } from '~/utils/api-urls'

interface IProps {
  children: React.ReactNode
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export default function FavoriteProvider({ children }: IProps) {
  const [favorites, setFavorites] = useState<number[]>([])

  const setFavorite = (fav: number[]) => setFavorites(fav)

  const addFavorite = async (productId: number): Promise<void> => {
    const data = { id: productId }
    await httpService.post(ACCOUNT_API + '/favorite', data)
    setFavorites((pre) => [...pre, productId])
  }

  const removeFavorite = async (productId: number): Promise<void> => {
    await httpService.del(ACCOUNT_API + `/favorite/${productId}`)
    setFavorites((pre) => pre.filter((id) => id !== productId))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorite, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
