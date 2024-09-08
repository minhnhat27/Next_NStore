import { HomeOutlined, ProductOutlined } from '@ant-design/icons'
import { Metadata, ResolvingMetadata } from 'next'
import BreadcrumbLink from '~/components/ui/breadcrumb'
import Details from './details'
import axios from 'axios'

// export const metadata: Metadata = {
//   title: 'Sản phẩm',
//   description: 'Fashions Store',
// }

const breadcrumbItems = (id: string, name: string | string[] | undefined) => [
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
    title: name ?? id,
  },
]

async function getDetails(id: string) {
  try {
    const res = await axios.get(process.env.API_URL + `/api/products/${id}`)
    const data: ProductDetailsType = res.data
    return data
  } catch (error: any) {
    return undefined
  }
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const name = searchParams.name?.toString()
  return {
    title: name,
    description: 'Fashion Store',
  }
}

export default async function ProductDetails({ params, searchParams }: Props) {
  const details = await getDetails(params.id)

  return (
    <>
      <div className="p-4 space-y-4">
        <BreadcrumbLink items={breadcrumbItems(params.id, searchParams?.name)} />
        <Details product={details} />
      </div>
    </>
  )
}
