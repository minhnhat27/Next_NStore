import { HomeOutlined, ProductOutlined } from '@ant-design/icons'
import { Metadata } from 'next'
import BreadcrumbLink from '~/components/ui/breadcrumb'
import Details from '../../../../components/fashions/product-details'
import axios from 'axios'
import { notFound } from 'next/navigation'

// export const revalidate = 7200

// export const dynamicParams = true

const breadcrumbItems = (name: string) => [
  {
    path: '/',
    title: <HomeOutlined />,
  },
  {
    path: 'fashions',
    title: (
      <>
        <ProductOutlined />
        <span className="ml-1">Fashions</span>
      </>
    ),
  },
  {
    title: name ?? 'Sản phẩm',
  },
]

interface IProps {
  params: { id: string }
  searchParams: { name: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: IProps): Promise<Metadata> {
  // const details = await getDetails(params.id)
  const name = searchParams.name?.toString()

  return {
    title: name ?? 'Chi tiết sản phẩm',
    description: 'Fashion Store',
  }
}

export default async function ProductDetails({ searchParams }: IProps) {
  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink
        items={breadcrumbItems(searchParams.name?.toString() ?? 'Chi tiết sản phẩm')}
      />
      <Details />
    </div>
  )
}
