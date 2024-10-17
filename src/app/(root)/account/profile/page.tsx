'use client'

import { App, Button, Form, FormProps, Input, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import ChangeEmail from '~/components/account/change-email'
import ChangeAddress from '~/components/cart/change-address'
import useAuth from '~/hooks/useAuth'
import httpService from '~/lib/http-service'
import { ACCOUNT_API } from '~/utils/api-urls'
import { showError } from '~/utils/common'

export default function Profile() {
  const [form] = Form.useForm()
  const { state } = useAuth()
  const { notification } = App.useApp()
  const session = state.userInfo?.session

  const [disabled, setDisabled] = useState<boolean>(true)

  const fullname = Form.useWatch('fullname', form)
  const phoneNumber = Form.useWatch('phoneNumber', form)

  const {
    data: info,
    isLoading: info_loading,
    mutate: info_mutate,
  } = useSWRImmutable<InfoType>([ACCOUNT_API + '/info', session], ([url, session]) =>
    httpService.getWithSession(url, session),
  )

  const {
    data: address,
    isLoading: address_loading,
    mutate: address_mutate,
  } = useSWRImmutable<AddressType>([ACCOUNT_API + '/address', session], ([url, session]) =>
    httpService.getWithSession(url, session),
  )

  useEffect(() => {
    if (
      info?.fullname?.trim() != fullname?.trim() ||
      info?.phoneNumber?.trim() != phoneNumber?.trim()
    ) {
      setDisabled(false)
    } else setDisabled(true)
  }, [fullname, phoneNumber, info])

  const [loading, setLoading] = useState<boolean>(false)

  const handleChangeInfo: FormProps['onFinish'] = async (values) => {
    try {
      setLoading(true)
      const result = await httpService.put(ACCOUNT_API + '/info', values)

      info_mutate({ email: info?.email, ...result })
      // dispatch()
      notification.success({
        message: 'Thành công',
        description: 'Đã cập nhật thông tin',
        className: 'text-green-500',
      })
    } catch (error: any) {
      notification.error({
        message: 'Thất bại',
        description: showError(error),
        className: 'text-red-500',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAddress = async (values: ReceiverType): Promise<boolean> => {
    try {
      const userAddress: AddressType = {
        ...address,
        name: values.fullname,
        detail: values.detail,
        provinceID: values.province.value,
        provinceName: values.province.label,
        wardID: values.ward.value,
        wardName: values.ward.label,
        districtID: values.district.value,
        districtName: values.district.label,
        phoneNumber: values.phoneNumber.toString(),
      }

      const result = await httpService.put(ACCOUNT_API + '/address', userAddress)
      address_mutate(result)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-4 w-full md:w-11/12 lg:w-3/4">
          {info_loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Form
              disabled={loading}
              layout="vertical"
              form={form}
              name="info"
              initialValues={{
                phoneNumber: info?.phoneNumber,
                fullname: info?.fullname,
              }}
              onFinish={handleChangeInfo}
            >
              <ChangeEmail info={info} info_mutate={info_mutate} />
              <Form.Item<InfoType>
                label="Họ và tên"
                name="fullname"
                rules={[{ required: true, message: 'Vui lòng nhập tên của bạn.' }]}
              >
                <Input size="large" placeholder="Tên của bạn" />
              </Form.Item>
              <Form.Item<InfoType>
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại.' }]}
              >
                <Input size="large" placeholder="Số điện thoại" />
              </Form.Item>

              <Button
                htmlType="submit"
                disabled={loading || disabled}
                loading={loading}
                type="primary"
              >
                Xác nhận
              </Button>
            </Form>
          )}

          <>
            {address_loading ? (
              <Skeleton active />
            ) : (
              <div className="">
                <div>Địa chỉ giao hàng</div>
                <ChangeAddress
                  className="mt-2"
                  address={address}
                  handleConfirmAddress={handleConfirmAddress}
                />
              </div>
            )}
          </>
        </div>
      </div>
    </>
  )
}
