interface ReceiverFieldType {
  fullname: string
  phoneNumber: number
  province: string
  district: string
  ward: string
  detail: string
}

interface ProvinceType {
  province_id: number
  province_name: string
}
interface DistrictType {
  district_id: number
  district_name: string
}
interface WardType {
  ward_id: number
  ward_name: string
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
