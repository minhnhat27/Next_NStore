interface OrderType {
  id: number
  orderDate: string
  total: number
  amountPaid: number
  paymentMethod: string
  orderStatus: number
  payBackUrl?: string
}

interface CreateOrderType {
  total: number
  shippingCost: number
  code?: string
  receiver: string
  deliveryAddress: string
  cartIds: string[]
  paymentMethodId: number
}

interface PaymentMethod {
  id: number
  name: string
  isActive: boolean
}
