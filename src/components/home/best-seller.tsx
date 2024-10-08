'use client'

import { Button, Skeleton } from 'antd'
import Link from 'next/link'
import useSWRImmutable from 'swr/immutable'
import { FASHION_API } from '~/utils/api-urls'
import httpService from '~/lib/http-service'
import CardProduct from '../fashions/card-product'

export default function BestSeller() {
  const params: FilterType = { page: 1, pageSize: 4, sorter: '0' }

  const { data, isLoading } = useSWRImmutable<PagedType<ProductType>>(
    [FASHION_API + '/filters', params],
    ([url, params]) => httpService.getWithParams(url, params),
  )

  return (
    <>
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
