export enum AuthTypeEnum {
  Register,
  ChangeEmail,
  ForgetPassword,
}

export enum OrderStatus {
  'Đang xử lý',
  'Đã xác nhận',
  'Chờ lấy hàng',
  'Đang vận chuyển',
  'Đang giao hàng',
  'Đã nhận hàng',
  'Đã hủy',
  'Tất cả',
}

export enum OrderStatusColor {
  'text-yellow-500',
  'text-blue-500',
  'text-teal-500',
  'text-purple-500',
  'text-orange-500',
  'text-green-500',
  'text-red-500',
}

export enum OrderStatusTag {
  'yellow',
  'blue',
  'cyan',
  'purple',
  'orange',
  'green',
  'red',
}

export enum OrderStatusTagColor {
  '#eab308',
  '#3b82f6',
  '#14b8a6',
  '#a855f7',
  '#f97316',
  '#22c55e',
  '#f43f5e', //"#ef4444"
}

export enum Gender {
  'Nam',
  'Nữ',
  'Unisex',
}

export enum LoginProvider {
  GOOGLE,
  FACEBOOK,
}
