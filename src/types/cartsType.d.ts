type CartItemType = {
  productId: number
  colorId?: number
  sizeId?: number
  quantity: number
}

interface CartItemsType {
  id: string

  productId: number
  productName: string
  imageUrl?: string
  quantity: number
  originPrice: number
  price: number
  discountPercent: number

  sizeId: number
  sizeName?: string

  sizeInStocks: SizeInStock[]

  colorId: number
  colorName?: string
  inStock: number
}

type UpdateCartItem = {
  sizeId?: number
  quantity?: number
}

interface VoucherType {
  code: string
  discountPercent?: number
  discountAmount?: number
  minOrder: number
  maxDiscount: number
  endDate: Date
}
