interface Filters extends PaginationType {
  sorter?: string
  materialIds?: string[]
  categoryIds?: string[]
  brandIds?: string[]
  rating?: number
  genders?: string[]
  minPrice?: number
  maxPrice?: number
  discount?: boolean
  flashsale?: boolean
}

interface FilterType extends Filters {
  priceRange?: number[]
  [key: string]: any
}

interface ProductType {
  id: number
  name: string
  enable: boolean
  gender: number
  sold: number
  discountPercent: number
  flashSaleDiscountPercent: number
  price: number
  categoryName: string
  brandName: string
  rating: number
  ratingCount: number
  imageUrl: string
}

interface ProductReviewsType {
  id: string
  description?: string
  star: number
  variant: string
  username: string
  imagesUrls: string[]
  createdAt: string
}

interface ProductAttrsType {
  id: number
  name: string
}

interface BrandType extends ProductAttrsType {
  imageUrl: string
}

interface SizeInStock {
  sizeId: int
  sizeName: string
  inStock: int
}

interface ColorSizes {
  id: number
  colorName: string
  imageUrl: string
  sizeInStocks: SizeInStock[]
}

interface ProductDetailsType extends ProductType {
  colorSizes: ColorSizes[]
  materialNames: string[]
  imageUrls: string[]
  description?: string
  endFlashSale: string
}

interface VNPayCallback {
  vnp_TmnCode: string
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo?: string
  vnp_CardType?: string
  vnp_PayDate?: string
  vnp_OrderInfo: string
  vnp_TransactionNo: string
  vnp_ResponseCode: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHashType?: string
  vnp_SecureHash: string
}

interface PayOSCallback {
  code: string
  id: string
  cancel: string
  status: string
  orderCode: string
}

interface FlashSaleResponse {
  endFlashSale: string
  products: ProductType[]
}
