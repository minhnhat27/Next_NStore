import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'
import useAuth from '~/hooks/useAuth'
import useFavorite from '~/hooks/useFavorites'

interface IProps {
  productId: number
  label?: boolean | React.ReactNode
}

export default function Heart({ productId, label = false }: IProps) {
  const { state } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const { favorites, addFavorite, removeFavorite } = useFavorite()

  const onRemoveFavorite = async () => {
    setLoading(true)
    await removeFavorite(productId)
    setLoading(false)
  }

  const onAddFavorite = async () => {
    setLoading(true)
    await addFavorite(productId)
    setLoading(false)
  }

  return (
    state.isAuthenticated &&
    (favorites.includes(productId) ? (
      <>
        <Button
          onClick={async (e) => {
            e.preventDefault()
            await onRemoveFavorite()
          }}
          type="link"
          disabled={loading}
          className="p-0 text-lg"
        >
          <HeartFilled className="transition-transform hover:scale-125 text-red-500" />
        </Button>
        {label === true ? (
          <span className="text-sm text-black">Đã thích</span>
        ) : label ? (
          label
        ) : null}
      </>
    ) : (
      <Button
        onClick={async (e) => {
          e.preventDefault()
          await onAddFavorite()
        }}
        type="link"
        disabled={loading}
        className="p-0 text-lg"
      >
        <HeartOutlined className="transition-transform hover:scale-125 text-red-500" />
      </Button>
    ))
  )
}
