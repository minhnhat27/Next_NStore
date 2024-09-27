interface OrderType {
  id: number
  orderDate: string
  total: number
  amountPaid: number
  paymentMethod: string
  orderStatus: number
}

interface CreateOrderType {
  total: number
  shippingCost: number
  code?: string
  receiver: string
  deliveryAddress: string
  cartIds: string[]
  paymentMethod: string
}

interface PaymentMethod {
  name: string
  isActive: boolean
}
