type LoginType = {
  username: string
  password: string
}

type RegisterType = {
  name: string
  email: string
  token: string
  password: string
}

type SendOTPType = {
  email: string
}

type VerifyOTPType = {
  email: string
  token: string
}

type UserInfoType = {
  fullName?: string
  session: string
}

type AuthActionType = {
  type: AuthActionEnums
  payload?: UserInfoType
}

type AuthStateType = {
  isAuthenticated: boolean
  userInfo?: UserInfoType
}

type LoginResType = {
  accessToken: string
  refreshToken: string
  fullName?: string
}

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
interface ReceiverFieldType {
  name: string
  phoneNumber: number
  province: string
  district: string
  ward: string
  address: string
  note: string
  paymentMethod: string
}

interface CartItemsType {
  productId: string
  productName: string
  imageUrl?: string
  quantity: number
  price: number
  discountPercent?: number
}

interface ProvinceType {
  province_id: number
  province_name: string
  province_type: string
}
interface DistrictType {
  district_id: number
  district_name: string
}
interface WardType {
  ward_id: number
  ward_name: string
}

type AuthHeaderType = { Authorization: string } | {}

interface PagedType<T> {
  items: T[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
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

interface ColorSizes {}

enum Gender {
  'Nam',
  'Nữ',
  'Unisex',
}

interface ColorSizes {
  id: number
  colorName: string
  imageUrl: string
  sizeInStocks: {
    sizeId: int
    sizeName: string
    inStock: int
  }[]
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
