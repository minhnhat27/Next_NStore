import { HomeOutlined, ProductOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Metadata } from 'next'
import Products from '../../../components/fashions/products-list'
import BreadcrumbLink from '~/components/ui/breadcrumb'

export const revalidate = 7200

export const metadata: Metadata = {
  title: 'Tất cả sản phẩm',
  description: 'Fashions Store',
}

const breadcrumbItems = [
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
]

async function getBrands() {
  try {
    const res = await axios.get(process.env.API_URL + '/api/brands')
    const data: ProductAttrsType[] = res.data
    return data
  } catch (error: any) {
    return []
  }
}

async function getCategories() {
  try {
    const res = await axios.get(process.env.API_URL + '/api/categories')
    const data: ProductAttrsType[] = res.data
    return data
  } catch (error: any) {
    return []
  }
}

async function getMaterialss() {
  try {
    const res = await axios.get(process.env.API_URL + '/api/materials')
    const data: ProductAttrsType[] = res.data
    return data
  } catch (error: any) {
    return []
  }
}

interface IProps {
  filters?: FilterType
}

export default async function Fashions({ filters }: IProps) {
  const brandsData: Promise<ProductAttrsType[]> = getBrands()
  const categoriesData: Promise<ProductAttrsType[]> = getCategories()
  const materialsData: Promise<ProductAttrsType[]> = getMaterialss()

  const [brands, categories, materials] = await Promise.all([
    brandsData,
    categoriesData,
    materialsData,
  ])

  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink items={breadcrumbItems} />
      <Products
        filtersProp={filters}
        brands={brands}
        categories={categories}
        material={materials}
      />
    </div>
  )
}
