interface OrderType {
  id: number
  orderDate: string
  total: number
  amountPaid: number
  paymentMethod: string
  orderStatus: number
  payBackUrl?: string
}

interface DeliveryInfo {
  receiver: string
  deliveryAddress: string
}

interface ProductOrderDetails {
  productName: string
  sizeName: string
  colorName: string
  sizeId: number
  colorId: number
  originPrice: number
  price: number
  quantity: number
  imageUrl?: string
}
interface OrderDetailsType extends OrderType, DeliveryInfo {
  productOrderDetails: ProductOrderDetails[]
  shippingCost: number
}

interface CreateOrderType extends DeliveryInfo {
  total: number
  shippingCost: number
  code?: string
  cartIds: string[]
  paymentMethodId: number
}

interface PaymentMethod {
  id: number
  name: string
  isActive: boolean
}
