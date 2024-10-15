'use client'

import {
  List,
  Image as AntdImage,
  Button,
  Skeleton,
  Popconfirm,
  ConfigProvider,
  Empty,
  Typography,
} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaInbox } from 'react-icons/fa'
import useSWRImmutable from 'swr/immutable'
import useAuth from '~/hooks/useAuth'
import useFavorite from '~/hooks/useFavorites'
import httpService from '~/lib/http-service'
import { ACCOUNT_API } from '~/utils/api-urls'
import { formatVND, toNextImageLink } from '~/utils/common'
import { initProduct } from '~/utils/initType'

export default function Favorite() {
  const { state } = useAuth()
  const session = state.userInfo?.session
  const { removeFavorite } = useFavorite()

  const [loading, setLoading] = useState<boolean>(true)

  const [currentImage, setCurrentImage] = useState<string>()
  const [visible, setVisible] = useState<boolean>(false)

  const [page, setPage] = useState<number>(1)

  const pageSize = 2

  // const [pageSize, setPageSize] = useState(() => {
  //   const p = searchParams.get('currentSize')
  //   return p ? parseInt(p) : pS
  // })

  // const [currentSize] = useState<number>(() => {
  //   const p = searchParams.get('currentSize')
  //   return p ? parseInt(p) : pS
  // })

  const [list, setList] = useState<ProductType[]>([])
  const [favorites, setFavorites] = useState<ProductType[]>([])

  const { data, isLoading, mutate } = useSWRImmutable<PagedType<ProductType>>(
    [ACCOUNT_API + '/favorite/products', session, { page, pageSize }],
    ([url, session, params]) => httpService.getWithSessionParams(url, session, params),
    { revalidateOnMount: true },
  )

  useEffect(() => {
    if (!isLoading) setLoading(false)
  }, [isLoading])

  useEffect(() => {
    if (data) {
      const newData = list.concat(data.items.filter((x) => !list.some((e) => e.id === x.id)))
      setList(newData)
      setFavorites(newData)
    }
  }, [data])

  const onLoadMore = () => {
    setFavorites(favorites.concat([...new Array(pageSize)].map(() => initProduct)))
    setPage((pre) => pre + 1)
  }

  const loadMore =
    !isLoading && data && data.totalItems > favorites.length ? (
      <div className="py-4 flex justify-center">
        <Button onClick={onLoadMore}>Xem thêm</Button>
      </div>
    ) : null

  const handleRemoveFavorite = async (id: number) => {
    await removeFavorite(id)
    const newFavorites = favorites.filter((x) => x.id !== id)
    const newList = list.filter((x) => x.id !== id)
    setFavorites(newFavorites)
    setList(newList)
    mutate()
  }

  return (
    <>
      <ConfigProvider
        renderEmpty={() => (
          <Empty
            image={<FaInbox className="text-blue-500 text-6xl" />}
            description={<Typography.Text>Chưa có sản phẩm yêu thích nào</Typography.Text>}
          >
            <Link href="/fashions">
              <Button type="primary">Xem các sản phẩm</Button>
            </Link>
          </Empty>
        )}
      >
        <List
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={favorites}
          renderItem={(item) => (
            <List.Item
              extra={
                <Popconfirm
                  title="Xóa khỏi yêu thích?"
                  onConfirm={() => handleRemoveFavorite(item.id)}
                >
                  <Button type="link">Xóa</Button>
                </Popconfirm>
              }
            >
              <Skeleton avatar title={false} loading={!item?.id} active>
                <List.Item.Meta
                  avatar={
                    <div
                      onClick={() => {
                        setVisible(true)
                        setCurrentImage(item.imageUrl)
                      }}
                      className="h-20 w-16 flex cursor-pointer"
                    >
                      <Image
                        height={0}
                        width={0}
                        sizes="20vw"
                        quality={50}
                        className="h-auto w-auto object-cover"
                        src={toNextImageLink(item.imageUrl)}
                        alt="Ảnh sản phẩm"
                      />
                    </div>
                  }
                  title={
                    <Link href={{ pathname: `/fashions/${item.id}`, query: { name: item.name } }}>
                      {item.name}
                    </Link>
                  }
                  description={
                    <div className="inline-flex gap-1">
                      <div className="text-red-500 text-lg font-semibold">
                        {formatVND.format(item.price - item.price * (item.discountPercent / 100.0))}
                      </div>
                      {!item.discountPercent || (
                        <div className="line-through">{formatVND.format(item.price)}</div>
                      )}
                    </div>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </ConfigProvider>
      {currentImage && (
        <AntdImage
          width={0}
          hidden
          preview={{
            visible,
            src: toNextImageLink(currentImage),
            onVisibleChange: (value) => setVisible(value),
          }}
        />
      )}
    </>
  )
}
