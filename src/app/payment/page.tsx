'use client'

import { App, Spin } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import httpService from '~/lib/http-service'
import { PAYMENT_API } from '~/utils/api-urls'
import NotFound from '../not-found'

export default function Payment() {
  const { notification } = App.useApp()
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlParams = new URLSearchParams(searchParams)
  const gateway = urlParams.get('gateway')

  let params = undefined
  let callbackUrl = undefined

  if (gateway === 'payos') {
    params = Object.fromEntries(urlParams.entries()) as unknown as PayOSCallback
    if (Object.values(params).some((value) => !value)) return <NotFound />

    callbackUrl = '/payos-callback'
  } else if (gateway === 'vnpay') {
    params = Object.fromEntries(urlParams.entries()) as unknown as VNPayCallback
    if (
      !params.vnp_TmnCode ||
      !params.vnp_Amount ||
      !params.vnp_SecureHash ||
      !params.vnp_ResponseCode ||
      !params.vnp_TransactionStatus ||
      !params.vnp_TransactionNo ||
      Object.entries(params).length === 0
    ) {
      return <NotFound />
    }

    callbackUrl = '/vnpay-callback'
  } else return <NotFound />

  const { isLoading, error } = useSWR([PAYMENT_API + callbackUrl, params], ([url, params]) =>
    httpService.getWithParams(url, params),
  )

  useEffect(() => {
    if (!isLoading) {
      error
        ? notification.error({
            message: 'Thanh toán thất bại',
            description: 'Vui lòng thanh toán lại',
            className: 'text-red-500',
          })
        : notification.success({
            message: 'Thanh toán thành công',
            description: 'Vui lòng kiểm tra lại đơn hàng của bạn',
            className: 'text-green-500',
          })
      router.replace('/account/purchase')
    }
  }, [isLoading])

  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <Spin /> Đang xử lý thanh toán...
      </div>
    </div>
  )
}
