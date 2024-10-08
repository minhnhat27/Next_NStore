'use client'

import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { HOME_API } from '~/utils/api-urls'
import CardProduct from '../fashions/card-product'
import { initProduct } from '~/utils/common'
import { useSearchParams } from 'next/navigation'
import { useRealTimeParams } from '~/hooks/useRealTimeParams'

export default function ProductHighlight() {
  const [list, setList] = useState<ProductType[]>([])
  const [featured, setFeatured] = useState<ProductType[]>([])
  const searchParams = useSearchParams()
  const { setRealTimeParams } = useRealTimeParams()

  const [page, setPage] = useState<number>(1)

  const pageSize = 2

  const [currentSize] = useState<number>(() => {
    const size = searchParams.get('currentSize')
    return size && parseInt(size) > pageSize ? parseInt(size) : pageSize
  })

  const { data, isLoading } = useSWRImmutable<PagedType<ProductType>>(
    [
      HOME_API + '/featured',
      {
        page: page === 1 ? page : currentSize + page - pageSize,
        pageSize: page === 1 ? currentSize : pageSize,
      },
    ],
    ([url, params]) => httpService.getWithParams(url, params),
  )

  useEffect(() => {
    if (data) {
      const newData = list.concat(data.items)
      setList(newData)
      setFeatured(newData)
    }
  }, [data])

  const onLoadMore = () => {
    const newData = featured.concat([...new Array(pageSize)].map(() => initProduct))
    setFeatured(newData)
    setRealTimeParams({ currentSize: newData.length })
    setPage((pre) => pre + 1)
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
        <CardProduct products={featured} height={20} />
      </div>
      {data && featured.length < data.totalItems && (
        <div className="flex justify-center my-6">
          <Button
            loading={isLoading}
            onClick={onLoadMore}
            className="uppercase text-base text-nowrap w-1/2 md:w-1/3 rounded-none"
            type="primary"
            danger
          >
            Xem thêm
          </Button>
        </div>
      )}
    </>
  )
}
