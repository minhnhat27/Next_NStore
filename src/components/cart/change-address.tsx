import { Button, Divider, Form, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { PROVINCE_API } from '~/utils/api-urls'
import { searchAddress } from '~/utils/common'

interface IProps {
  address?: AddressType
  handleConfirmAddress: (values: ReceiverType) => Promise<boolean>
  truncate?: boolean
  className?: string
}

export default function ChangeAddress({
  address,
  handleConfirmAddress,
  truncate = false,
  className,
}: IProps) {
  const [form] = Form.useForm()

  const [openModalAddress, setOpenModalAddress] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [beginFetch, setBeginFetch] = useState<boolean>(false)

  const [province, setProvince] = useState<ValueLabelType[]>([])
  const [district, setDistrict] = useState<ValueLabelType[]>([])
  const [ward, setWard] = useState<ValueLabelType[]>([])

  const province_id = Form.useWatch('province', form)?.value
  const district_id = Form.useWatch('district', form)?.value

  const { data: provinceData, isLoading: p_load } = useSWRImmutable(
    beginFetch && PROVINCE_API,
    httpService.get,
  )
  const { data: districtData, isLoading: d_load } = useSWRImmutable(
    beginFetch && province_id && PROVINCE_API + `/district/${province_id}`,
    httpService.get,
  )
  const { data: wardData, isLoading: w_load } = useSWRImmutable(
    beginFetch && district_id && PROVINCE_API + `/ward/${district_id}`,
    httpService.get,
  )

  useEffect(() => {
    if (provinceData) {
      const data: ValueLabelType[] = provinceData.map(
        (item: { ProvinceID: number; ProvinceName: string }) => ({
          value: item.ProvinceID,
          label: item.ProvinceName,
        }),
      )
      setProvince(data)
    }
  }, [provinceData])

  useEffect(() => {
    if (districtData) {
      const data: ValueLabelType[] = districtData.map(
        (item: { DistrictID: number; DistrictName: string }) => ({
          value: item.DistrictID,
          label: item.DistrictName,
        }),
      )
      setDistrict(data)
    }
  }, [districtData])

  useEffect(() => {
    if (wardData) {
      const data: ValueLabelType[] = wardData.map(
        (item: { WardCode: number; WardName: string }) => ({
          value: item.WardCode,
          label: item.WardName,
        }),
      )
      setWard(data)
    }
  }, [wardData])

  const onFinish = async (values: ReceiverType) => {
    setLoading(true)
    const result = await handleConfirmAddress(values)
    if (result) setOpenModalAddress(false)

    setLoading(false)
  }

  return (
    <>
      <Modal
        open={openModalAddress}
        onCancel={() => setOpenModalAddress(false)}
        okText="Xác nhận"
        okButtonProps={{ autoFocus: true, htmlType: 'submit', loading: loading }}
        cancelButtonProps={{ disabled: loading }}
        destroyOnClose
        centered
        modalRender={(dom) => (
          <Form
            disabled={loading}
            layout="vertical"
            form={form}
            name="address"
            initialValues={{
              phoneNumber: address?.phoneNumber,
              fullname: address?.name,
              province: address?.provinceID && {
                value: address.provinceID,
                label: address.provinceName,
              },
              district: address?.districtID && {
                value: address?.districtID,
                label: address?.districtName,
              },
              ward: address?.wardID && {
                value: address?.wardID,
                label: address?.wardName,
              },
              detail: address?.detail,
            }}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item<ReceiverType>
            label="Tên người nhận"
            name="fullname"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận.' }]}
          >
            <Input size="large" placeholder="Tên người nhận" />
          </Form.Item>
          <Form.Item<ReceiverType>
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại.' }]}
          >
            <Input size="large" placeholder="Số điện thoại" />
          </Form.Item>
        </div>
        <Form.Item<ReceiverType>
          label="Tỉnh/TP"
          name="province"
          // getValueProps={(e) => console.log(e)}
          rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố.' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            labelInValue
            filterOption={searchAddress}
            loading={p_load}
            options={province}
            onClick={() => setBeginFetch(true)}
            onSelect={() =>
              form.setFieldsValue({
                district: undefined,
                ward: undefined,
              })
            }
            size="large"
            placeholder="Chọn"
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item<ReceiverType>
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện.' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              labelInValue
              filterOption={searchAddress}
              options={district}
              loading={d_load}
              disabled={!province_id || loading}
              onClick={() => setBeginFetch(true)}
              onSelect={() => form.setFieldValue('ward', undefined)}
              size="large"
              placeholder="Chọn"
            />
          </Form.Item>
          <Form.Item<ReceiverType>
            label="Phường/Xã"
            name="ward"
            rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã.' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              labelInValue
              filterOption={searchAddress}
              options={ward}
              loading={w_load}
              onClick={() => setBeginFetch(true)}
              disabled={!district_id || loading}
              size="large"
              placeholder="Chọn"
            />
          </Form.Item>
        </div>
        <Form.Item<ReceiverType>
          label="Địa chỉ cụ thể"
          name="detail"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng.' }]}
        >
          <Input showCount maxLength={30} size="large" placeholder="Địa chỉ" />
        </Form.Item>
      </Modal>
      <div className={className}>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3 flex items-center gap-1">
            <FaLocationDot className="text-xl text-red-600" />
            <div className="font-bold inline-block truncate">
              {address?.name || address?.phoneNumber ? (
                <>
                  {address && address.name}
                  <Divider type="vertical" />
                  {address?.phoneNumber}
                </>
              ) : (
                'Chưa có thông tin'
              )}
            </div>
          </div>
          <Button
            type="link"
            onClick={() => setOpenModalAddress(true)}
            className="px-0 w-fit justify-self-end"
          >
            Thay đổi
          </Button>
        </div>
        {address &&
        address.detail &&
        address.wardName &&
        address.districtName &&
        address.provinceName ? (
          <div className={truncate ? 'truncate' : 'line-clamp-2'}>
            {address.detail}, {address.wardName}, {address.districtName}, {address.provinceName}
          </div>
        ) : (
          'Chưa chọn địa chỉ'
        )}
      </div>
    </>
  )
}
