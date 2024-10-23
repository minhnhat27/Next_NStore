import { Button } from 'antd'
import Link from 'next/link'
import { FASHION_API, PRODUCT_API } from '~/utils/api-urls'
import httpService from '~/lib/http-service'
import CardProduct from '~/components/ui/card-product'

export const revalidate = 3600

const API_URL = process.env.API_URL

const getBestSeller = async (): Promise<PagedType<ProductType> | undefined> => {
  try {
    const params: FilterType = { page: 1, pageSize: 4, sorter: '0' }
    const data = await httpService.getWithParams(API_URL + PRODUCT_API + '/filters', params)

    return data
  } catch (error) {
    return undefined
  }
}

export default async function BestSeller() {
  // const a = () => new Promise((r) => setTimeout(r, 5000))
  // await a()

  const data = await getBestSeller()

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-24 md:px-16 lg:px-28">
        <CardProduct products={data?.items} className="h-72 md:h-80" />
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
