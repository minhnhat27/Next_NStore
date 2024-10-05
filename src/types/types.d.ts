interface ReceiverType {
  fullname: string
  phoneNumber: number
  province: ValueLabelType
  district: ValueLabelType
  ward: ValueLabelType
  detail: string
}

interface ProvinceType {
  province_id?: number | string
  province_name?: string
}
interface DistrictType {
  district_id?: number | string
  district_name?: string
}
interface WardType {
  ward_id?: number | string
  ward_name?: string
}

type ValueLabelType = {
  value: number | string
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
