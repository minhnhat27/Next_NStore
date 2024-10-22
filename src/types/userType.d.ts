interface AddressType extends ProvinceType, DistrictType, WardType {
  name: string
  phoneNumber?: string
  detail?: string
}

interface InfoType {
  fullname?: string
  phoneNumber?: string
  email?: string

  facebook?: boolean
}

type ChangePasswordType = {
  currentPassword?: string
  newPassword?: string
  confirm?: string
}
