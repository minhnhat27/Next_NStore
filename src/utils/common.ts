export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeout: NodeJS.Timeout | null = null
  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, delay)
  }
}

export const formatVND = new Intl.NumberFormat('vi', {
  style: 'currency',
  currency: 'VND',
})

export const formatUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const showError = (error: any): string =>
  error.response?.data?.title || error.response?.data || error.message || 'Đã xảy ra lỗi'

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
