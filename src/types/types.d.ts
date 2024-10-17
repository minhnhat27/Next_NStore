interface ReceiverType {
  fullname: string
  phoneNumber: number
  province: ValueLabelType
  district: ValueLabelType
  ward: ValueLabelType
  detail: string
}

interface ProvinceType {
  provinceID?: number
  provinceName?: string
}
interface DistrictType {
  districtID?: number
  districtName?: string
}
interface WardType {
  wardID?: number
  wardName?: string
}

type ValueLabelType = {
  value: number
  label: string
}

type AuthHeaderType = { Authorization: string } | {}

interface PagedType<T> {
  items: T[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
}

interface PaginationType {
  page: number
  pageSize: number
  key?: string
}
