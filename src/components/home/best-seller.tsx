'use client'

import { Badge, Button, Card, Divider, Flex, Rate, Skeleton } from 'antd'
import Link from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { FASHION_API } from '~/utils/api-urls'
import httpService from '~/lib/http-service'
import Image from 'next/image'
import { formatVND, toNextImageLink } from '~/utils/common'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import useFavorite from '~/hooks/useFavorites'
import useAuth from '~/hooks/useAuth'
import CardProduct from '../fashions/card-product'

const { Meta } = Card

export default function BestSeller() {
  const { state } = useAuth()

  const { favorites, addFavorite, removeFavorite } = useFavorite()
  const params: FilterType = { page: 1, pageSize: 4, sorter: '0' }

  const { data, isLoading } = useSWRImmutable<PagedType<ProductType>>(
    [FASHION_API + '/filters', params],
    ([url, params]) => httpService.getWithParams(url, params),
  )

  return (
    <>
      <Divider>
        <div className="text-center my-6 font-semibold text-xl md:text-3xl text-blue-950 font-sans">
          Sản phẩm bán chạy
        </div>
      </Divider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-8 md:px-24 lg:px-28">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton.Image active className="h-64 md:h-80 w-full" key={i} />
          ))
        ) : (
          <CardProduct products={data?.items} />
        )}
      </div>
      <Link href="/fashions" className="flex justify-center my-6">
        <Button
          className="uppercase text-base text-nowrap w-1/2 md:w-1/3 rounded-none"
          type="default"
        >
          Xem tất cả
        </Button>
      </Link>
    </>
  )
}
