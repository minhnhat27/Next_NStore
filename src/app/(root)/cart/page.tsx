import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Metadata } from 'next'
import CartDetails from '../../../components/cart/cart-details'
import BreadcrumbLink from '~/components/ui/breadcrumb'
import { PAYMENT_API } from '~/utils/api-urls'
import httpService from '~/lib/http-service'

export const revalidate = 360

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

const getPaymentMethod = async (): Promise<PaymentMethod[]> => {
  try {
    const data = await httpService.get(process.env.API_URL + PAYMENT_API)
    return data
  } catch (error) {
    return []
  }
}

export default async function Cart() {
  const paymentMethod = await getPaymentMethod()

  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink items={breadcrumbItems} />
      <CartDetails paymentMethods={paymentMethod} />
    </div>
  )
}
