interface Filters {
  page: number | 1
  pageSize: number | 10
  sorter?: number
  materialIds?: number[]
  categoryIds?: number[]
  brandIds?: number[]
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
