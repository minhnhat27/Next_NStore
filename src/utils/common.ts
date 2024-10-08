export const formatVND = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'VND',
})

// export const formatVND = (value: number) =>
//   new Intl.NumberFormat('vi', {
//     style: 'currency',
//     currency: 'VND',
//   }).format(value)

export const formatUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type error = {
  response?: {
    data?: {
      title?: string
      message?: string
    }
    message?: string
  }
  message?: string
}

export const showError = (error: error): string => {
  if (typeof error.response?.data === 'string') {
    return error.response?.data || error.response?.message || error.message || 'Đã xảy ra lỗi'
  }
  return (
    error.response?.data?.title ||
    error.response?.data?.message ||
    error.response?.message ||
    error.message ||
    'Đã xảy ra lỗi'
  )
}

export const convertToVietnamPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')

  if (cleaned.startsWith('0')) {
    return '+84' + cleaned.slice(1)
  }

  if (cleaned.startsWith('84') && !cleaned.startsWith('+84')) {
    return '+84' + cleaned.slice(2)
  }

  if (cleaned.startsWith('+84')) {
    return cleaned
  }

  return phoneNumber
}

export function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD') // Chuẩn hóa chuỗi sang dạng Normalization Form D
    .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu (tổ hợp ký tự Unicode)
    .replace(/đ/g, 'd') // Thay thế chữ đ thường
    .replace(/Đ/g, 'D') // Thay thế chữ Đ hoa
}

export const searchAddress = (input: string, option?: ValueLabelType) => {
  const inputWords = input.split(' ').map((word) => word.toLowerCase())

  const data = inputWords.every((word) => (option?.label ?? '').toLowerCase().includes(word))

  const vn = inputWords.every((word) =>
    removeVietnameseTones(option?.label ?? '')
      .toLowerCase()
      .includes(removeVietnameseTones(word)),
  )

  return data || vn
}

export const toNextImageLink = (url: string | undefined): string =>
  url ? '/api/images?imageUrl=' + encodeURIComponent(url) : '/images/broken.png'

export const shippingPrice = (price: number): number =>
  price >= 400000 || price === 0 ? 0 : price >= 200000 ? 10000 : 30000

export const formatDate = (value: string | Date) => {
  const date = new Date(value)

  return date
    .toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replaceAll('/', '-')
}

export const formatDateTime = (value: string | Date) => {
  const date = new Date(value)

  return date
    .toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replaceAll('/', '-')
}

enum OrderStatus {
  'Đang xử lý',
  'Đã xác nhận',
  'Chờ lấy hàng',
  'Đang vận chuyển',
  'Đang giao hàng',
  'Đã nhận hàng',
  'Đã hủy',
}

export const getOrderStatus = (index: number) => OrderStatus[index] ?? OrderStatus[0]
export const Cancel_Status: number = 6
export const Received_Status: number = 5

export const getPaymentDeadline = (date: string) => new Date(date).getTime() + 1000 * 60 * 15

export const initProduct: ProductType = {
  id: 0,
  name: '',
  description: '',
  enable: false,
  gender: 0,
  sold: 0,
  discountPercent: 0,
  price: 0,
  categoryName: '',
  brandName: '',
  imageUrl: '',
}
