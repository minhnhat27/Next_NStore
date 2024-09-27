import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Metadata } from 'next'
import CartDetails from '../../../components/cart/cart-details'
import BreadcrumbLink from '~/components/ui/breadcrumb'
import httpService from '~/lib/http-service'
import { PAYMENT_API } from '~/utils/api-urls'
import axios from 'axios'

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
    return await httpService.get(process.env.API_URL + PAYMENT_API)
  } catch (error) {
    return []
  }
}

const getPickAddressId = async () => {
  try {
    const { data } = await axios.get(process.env.GHTK_API + '/services/shipment/list_pick_add', {
      headers: {
        Token: process.env.GHTK_TOKEN,
      },
    })
    return data
  } catch (error) {
    return null
  }
}

export default async function Cart() {
  const paymentMethod = await getPaymentMethod()
  // const pickAddress = getPickAddressId()

  // const [payment_method, pick_address] = await Promise.all([paymentMethod, pickAddress])
  // console.log(pick_address)

  // const pick_address_id = pick_address?.data?.map((e: any) => e.pick_address_id)

  return (
    <div className="p-4 space-y-4">
      <BreadcrumbLink items={breadcrumbItems} />
      <CartDetails paymentMethods={paymentMethod} />
    </div>
  )
}
