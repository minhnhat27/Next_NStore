import { Button, Form, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import useSWRImmutable from 'swr/immutable'
import useAuth from '~/hooks/useAuth'
import httpService from '~/lib/http-service'
import { PROVINCE_API } from '~/utils/api-urls'
import { removeVietnameseTones, searchAddress } from '~/utils/common'

type UserAddress = {
  fullname: number
  phoneNumber: number
  province_id: number
  province_name: string
  district_id: number
  district_name: string
  ward_id: number
  ward_name: string
  detail: string
}

export default function ChangeAddress() {
  const [form] = Form.useForm()
  const { state } = useAuth()
  const fullname = state.userInfo?.fullname
  const [openModalAddress, setOpenModalAddress] = useState<boolean>(false)

  const [beginFetch, setBeginFetch] = useState<boolean>(false)

  const [province, setProvince] = useState<ValueLabelType[]>([])
  const [district, setDistrict] = useState<ValueLabelType[]>([])
  const [ward, setWard] = useState<ValueLabelType[]>([])

  const province_id = Form.useWatch('province', form)
  const district_id = Form.useWatch('district', form)

  const { data: provinceData, isLoading: p_load } = useSWRImmutable(
    beginFetch && PROVINCE_API,
    httpService.get,
  )

  const { data: districtData, isLoading: d_load } = useSWRImmutable(
    province_id && PROVINCE_API + `/district/${province_id}`,
    httpService.get,
  )
  const { data: wardData, isLoading: w_load } = useSWRImmutable(
    district_id && PROVINCE_API + `/ward/${district_id}`,
    httpService.get,
  )

  useEffect(() => {
    if (provinceData) {
      const data: ValueLabelType[] = provinceData.results?.map((item: ProvinceType) => ({
        value: item.province_id,
        label: item.province_name,
      }))
      setProvince(data)
    }
  }, [provinceData])

  useEffect(() => {
    if (districtData) {
      const data: ValueLabelType[] = districtData.results?.map((item: DistrictType) => ({
        value: item.district_id,
        label: item.district_name,
      }))
      setDistrict(data)
    }
  }, [districtData])

  useEffect(() => {
    if (wardData) {
      const data: ValueLabelType[] = wardData.results?.map((item: WardType) => ({
        value: item.ward_id,
        label: item.ward_name,
      }))
      setWard(data)
    }
  }, [wardData])

  const handleConfirmAddress = (values: ReceiverFieldType) => {}

  return (
    <>
      <Modal
        open={openModalAddress}
        onCancel={() => setOpenModalAddress(false)}
        okText="Xác nhận"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        // destroyOnClose
        centered
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="address"
            initialValues={{ phoneNumber: 84358103707, fullname: fullname }}
            // clearOnDestroy
            onFinish={(values) => handleConfirmAddress(values)}
          >
            {dom}
          </Form>
        )}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item<ReceiverFieldType>
            label="Tên người nhận"
            name="fullname"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận.' }]}
          >
            <Input size="large" placeholder="Tên người nhận" />
          </Form.Item>
          <Form.Item<ReceiverFieldType>
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại.' }]}
          >
            <Input size="large" placeholder="Số điện thoại" />
          </Form.Item>
        </div>
        <Form.Item<ReceiverFieldType>
          label="Tỉnh/TP"
          name="province"
          rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố.' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
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
          <Form.Item<ReceiverFieldType>
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện.' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              filterOption={searchAddress}
              options={district}
              loading={d_load}
              disabled={!province_id}
              onSelect={() => form.setFieldValue('ward', undefined)}
              size="large"
              placeholder="Chọn"
            />
          </Form.Item>
          <Form.Item<ReceiverFieldType>
            label="Phường/Xã"
            name="ward"
            rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã.' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              filterOption={searchAddress}
              options={ward}
              loading={w_load}
              disabled={!district_id}
              size="large"
              placeholder="Chọn"
            />
          </Form.Item>
        </div>
        <Form.Item<ReceiverFieldType>
          label="Địa chỉ cụ thể"
          name="detail"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng.' }]}
        >
          <Input size="large" placeholder="Địa chỉ" />
        </Form.Item>
      </Modal>
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-2 flex items-center gap-1">
          <FaLocationDot className="text-xl text-red-600" />
          <div className="font-bold inline-block truncate">Minh Nhật (+84) 358103707</div>
        </div>
        <Button
          type="link"
          onClick={() => setOpenModalAddress(true)}
          className="px-0 w-fit justify-self-end"
        >
          Thay đổi
        </Button>
      </div>
      <div className="truncate">Hẻm 2B Nguyễn Việt Hồng, An Phú, Ninh Kiều, TP Cần Thơ</div>
    </>
  )
}
