import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Metadata } from 'next'
import CartDetails from '../../../components/cart/cart-details'
import BreadcrumbLink from '~/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description: 'Fashions Store',
}

const breadcrumbItems = [
  {
    path: '/',
    title: <HomeOutlined />,
  },
  {
    path: 'cart',
    title: (
      <>
        <ShoppingCartOutlined />
        <span className="ml-1">Giỏ hàng</span>
      </>
    ),
  },
]

export default async function Cart() {
  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink items={breadcrumbItems} />
      <CartDetails />
    </div>
  )
}
