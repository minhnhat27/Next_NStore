'use client'

import { App, Spin } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import httpService from '~/lib/http-service'
import { PAYMENT_API } from '~/utils/api-urls'
import NotFound from '../not-found'

export default function Payment() {
  const { notification } = App.useApp()
  const searchParams = useSearchParams()
  const router = useRouter()

  // const urlParams = new URLSearchParams(searchParams)
  const urlParamsRef = useRef(new URLSearchParams(searchParams))
  const gateway = urlParamsRef.current.get('gateway')

  const [params, setParams] = useState<any>()
  const [callbackUrl, setCallbackUrl] = useState<string>()

  useEffect(() => {
    if (gateway === 'payos') {
      const newParams = Object.fromEntries(
        urlParamsRef.current.entries(),
      ) as unknown as PayOSCallback
      if (Object.values(newParams).some((value) => !value)) {
        setParams(undefined)
        setCallbackUrl(undefined)
      }
      setParams(newParams)
      setCallbackUrl('/payos-callback')
    } else if (gateway === 'vnpay') {
      const newParams = Object.fromEntries(
        urlParamsRef.current.entries(),
      ) as unknown as VNPayCallback
      if (
        !newParams.vnp_TmnCode ||
        !newParams.vnp_Amount ||
        !newParams.vnp_SecureHash ||
        !newParams.vnp_ResponseCode ||
        !newParams.vnp_TransactionStatus ||
        !newParams.vnp_TransactionNo ||
        Object.entries(newParams).length === 0
      ) {
        setParams(undefined)
        setCallbackUrl(undefined)
      }
      setParams(newParams)
      setCallbackUrl('/vnpay-callback')
    }
  }, [gateway, urlParamsRef])

  useEffect(() => {
    const handlePayment = async () => {
      if (params && callbackUrl) {
        let success = false
        try {
          await httpService.getWithParams(PAYMENT_API + callbackUrl, params)
          notification.success({
            message: 'Thanh toán thành công',
            description: 'Vui lòng kiểm tra lại đơn hàng của bạn',
            className: 'text-green-500',
          })
          success = true
        } catch (error) {
          notification.error({
            message: 'Thanh toán thất bại',
            description: 'Vui lòng thanh toán lại',
            className: 'text-red-500',
          })
        } finally {
          router.replace(`/account/purchase?orderStatus=${success ? 1 : 0}`)
        }
      }
    }
    handlePayment()
  }, [params, callbackUrl, notification, router])

  if (!params || !callbackUrl || !gateway) return <NotFound />

  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <Spin /> Đang xử lý thanh toán...
      </div>
    </div>
  )
}
