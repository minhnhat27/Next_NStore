'use client'

import { CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import {
  List,
  Button,
  Skeleton,
  ConfigProvider,
  Empty,
  Typography,
  Tooltip,
  Rate,
  Watermark,
  Tag,
} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaInbox } from 'react-icons/fa'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import useAuth from '~/hooks/useAuth'
import useFavorite from '~/hooks/useFavorites'
import httpService from '~/lib/http-service'
import { Gender } from '~/types/enum'
import { ACCOUNT_API } from '~/utils/api-urls'
import { formatVND, toNextImageLink } from '~/utils/common'
import { initProduct } from '~/utils/initType'

export default function Favorite() {
  const { state } = useAuth()
  const session = state.userInfo?.session
  const { removeFavorite } = useFavorite()

  const [loading, setLoading] = useState<boolean>(true)

  const [page, setPage] = useState<number>(1)

  const pageSize = 2

  const [list, setList] = useState<ProductType[]>([])
  const [favorites, setFavorites] = useState<ProductType[]>([])

  const { data, isLoading, mutate } = useSWR<PagedType<ProductType>>(
    [ACCOUNT_API + '/favorite/products', session, { page, pageSize }],
    ([url, session, params]) => httpService.getWithSessionParams(url, session, params),
    { revalidateOnMount: true },
  )

  useEffect(() => {
    if (!isLoading) setLoading(false)
  }, [isLoading])

  useEffect(() => {
    if (data) {
      setList((pre) => {
        const newData = pre.concat(data.items.filter((x) => !pre.some((e) => e.id === x.id)))
        setFavorites(newData)
        return newData
      })
    }
  }, [data])

  const onLoadMore = () => {
    setFavorites(favorites.concat([...new Array(pageSize)].map(() => initProduct)))
    setPage((pre) => pre + 1)
  }

  const loadMore =
    !isLoading && data && data.totalItems > favorites.length ? (
      <div className="pt-6 flex justify-center">
        <Button type="primary" className="rounded-sm" danger onClick={onLoadMore}>
          Xem thêm
        </Button>
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
          className="md:px-4"
          renderItem={(item) => {
            const discountPercent = item.flashSaleDiscountPercent || item.discountPercent
            return (
              <List.Item className="relative">
                <Skeleton avatar title={false} loading={!item?.id} active>
                  <List.Item.Meta
                    avatar={
                      <Image
                        height={0}
                        width={0}
                        sizes="20vw"
                        quality={50}
                        className="h-24 md:h-32 w-20 md:w-28 object-cover"
                        src={toNextImageLink(item.imageUrl)}
                        alt="Ảnh sản phẩm"
                      />
                    }
                    description={
                      <div className="flex flex-col md:flex-row justify-between gap-2">
                        <div>
                          <div className="text-xs">Thời trang {Gender[item.gender]}</div>
                          <Link
                            onClick={(e) => !item.enable && e.preventDefault()}
                            href={{
                              pathname: `/fashions/${item.id}`,
                              query: { name: item.name },
                            }}
                          >
                            <div className="text-black text-sm md:text-base font-semibold py-1 line-clamp-2">
                              {item.name}
                            </div>
                          </Link>
                          <div className="text-xs md:text-sm">{item.sold} lượt bán</div>
                          <div className="text-xs md:text-sm">
                            <Rate disabled value={1} count={1} />
                            {item.ratingCount > 0 ? (
                              <>
                                <span className="text-red-500">{item.rating}</span> (
                                {item.ratingCount} lượt đánh giá)
                              </>
                            ) : (
                              '(Chưa có đánh giá)'
                            )}
                          </div>
                          {!item.flashSaleDiscountPercent || (
                            <Tag color="#ef4444" className="m-2 py-0 animate-pulse">
                              Flash sale
                            </Tag>
                          )}
                        </div>
                        <div className="md:mr-8 md:self-center flex flex-row-reverse justify-end md:flex-col gap-1">
                          {!discountPercent || (
                            <div className="line-through text-gray-500 text-xs">
                              {formatVND.format(item.price)}
                            </div>
                          )}
                          <div className="text-red-500 text-lg font-semibold">
                            {formatVND.format(item.price - item.price * (discountPercent / 100.0))}
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <Tooltip title="Xóa khỏi yêu thích">
                    <Button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="absolute p-2 top-1 right-0"
                      type="text"
                    >
                      <CloseOutlined />
                    </Button>
                  </Tooltip>
                </Skeleton>
              </List.Item>
            )
          }}
        />
      </ConfigProvider>
    </>
  )
}
