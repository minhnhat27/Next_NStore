import { HomeOutlined, ProductOutlined } from '@ant-design/icons'
import { Metadata } from 'next'
import BreadcrumbLink from '~/components/ui/breadcrumb'
import Details from '../../../../components/fashions/product-details'
import { notFound } from 'next/navigation'

export const revalidate = 360

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
  const name = searchParams.name?.toString()

  return {
    title: name ?? 'Chi tiết sản phẩm',
    description: 'Fashion Store',
  }
}

// const API_URL = process.env.API_URL

// const getProduct = async (id: number): Promise<ProductDetailsType | undefined> => {
//   try {
//     const data = await httpService.get(`${API_URL}${PRODUCT_API}/${id}`)
//     return data
//   } catch (error) {
//     return undefined
//   }
// }

export default async function ProductDetails({ params, searchParams }: IProps) {
  const id = parseInt(params.id)
  if (isNaN(id) || !id) return notFound()

  // const product = await getProduct(id)
  // if (!product) return <Result status={404} title="Không tìm thấy sản phẩm" />

  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink
        items={breadcrumbItems(searchParams.name?.toString() ?? 'Chi tiết sản phẩm')}
      />
      <Details id={id} />
    </div>
  )
}
