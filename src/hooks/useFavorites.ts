import { useContext } from 'react'
import { FavoritesContext } from '~/components/common/favorite-provider'

const useFavorite = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorite must be used within an FavoritesProvider')
  }
  return context
}
export default useFavorite
