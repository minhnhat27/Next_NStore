interface OrderType {
  id: number
  orderDate: string
  shippingCost: number
  receivedDate?: string
  reviewed?: boolean
  total: number
  amountPaid: number
  paymentMethodName: string
  orderStatus: number

  voucherDiscount: number

  shippingCode?: string
  expected_delivery_time?: string

  productOrderDetail: ProductOrderDetail

  payBackUrl?: string
}

interface DeliveryInfo {
  receiver: string
  deliveryAddress: string
}

interface ProductOrderDetail {
  productId?: number
  productName: string
  sizeName: string
  colorName: string
  originPrice: number
  price: number
  quantity: number
  imageUrl?: string
}
interface OrderDetailsType extends OrderType, DeliveryInfo {
  productOrderDetails: ProductOrderDetail[]
}

interface CreateOrderType extends DeliveryInfo {
  total: number
  shippingCost: number
  code?: string
  cartIds: string[]
  paymentMethodId: number

  districtID: number
  wardID: string
}

interface PaymentMethod {
  id: number
  name: string
  isActive: boolean
}
