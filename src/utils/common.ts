import dayjs from 'dayjs'
import { OrderStatus } from '~/types/enum'

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

export const showError = (error: error | any | unknown): string => {
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

export const toExternalNextImage = (url: string | undefined): string =>
  url ? '/api/images/external?imageUrl=' + encodeURIComponent(url) : '/images/broken.png'

export const shippingPrice = (price: number): number =>
  price >= 400000 || price === 0 ? 0 : price >= 200000 ? 10000 : 30000

export const formatDate = (value: string | Date) => dayjs(value).format('DD-MM-YYYY')

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

export const getTimeHHmm = (value?: string) => {
  const date = value ? new Date(value) : new Date()

  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getOrderStatus = (index: number) => OrderStatus[index] ?? OrderStatus[0]

export const getPaymentDeadline = (date: string) => new Date(date).getTime() + 1000 * 60 * 15

export const maskEmail = (email: string): string => {
  const emailParts = email.split('@')
  if (emailParts.length !== 2) {
    return 'Email không hợp lệ'
  }

  const name = emailParts[0]
  const domain = emailParts[1]

  const visibleChars = name.length < 5 ? 2 : 5
  const maskedName = name.substring(0, visibleChars).padEnd(name.length, '*')

  return `${maskedName}@${domain}`
}

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const compressImage = (file: any) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as any

      const MAX_WIDTH = 480
      const MAX_HEIGHT = 480
      let width = img.width
      let height = img.height

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width / MAX_WIDTH > height / MAX_HEIGHT) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        } else {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      let quality = 1
      const MAX_SIZE = 24 * 1024

      const checkSizeAndCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= MAX_SIZE) {
              const reader = new FileReader()
              reader.onloadend = () => {
                resolve(reader.result)
              }
              reader.readAsDataURL(blob)
            } else if (quality > 0.1) {
              quality -= 0.1
              checkSizeAndCompress()
            } else {
              resolve(null)
            }
          },
          'image/jpeg',
          quality,
        )
      }
      checkSizeAndCompress()
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })

export const formatCount = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

export const rateDesc = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời']
