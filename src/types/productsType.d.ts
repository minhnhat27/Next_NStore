interface Filters {
  page: number
  pageSize: number
  sorter?: string
  materialIds?: string[]
  categoryIds?: string[]
  brandIds?: string[]
  rating?: number
  minPrice?: number
  maxPrice?: number
  [key: string]: any
}

interface FilterType extends Filters {
  priceRange?: number[]
  sales?: string[]
}

interface ProductType {
  id: number
  name: string
  description: string
  enable: boolean
  gender: number
  sold: number
  discountPercent: number
  price: number
  categoryName: string
  brandName: string
  imageUrl: string
}

interface ProductAttrsType {
  id: number
  name: string
}

enum Gender {
  'Nam',
  'Nữ',
  'Unisex',
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

interface ProductDetailsType {
  id: number
  name: string
  description?: string
  enable: boolean
  gender: Gender
  sold: number
  discountPercent: number
  price: number
  categoryId: number
  brandId: number
  materialIds: number[]
  colorSizes: ColorSizes[]
  imageUrls: string[]
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
