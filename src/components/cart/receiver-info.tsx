import { Button, Flex, Form, Input, Radio, RadioChangeEvent, Select, Space, Typography } from 'antd'
import Image from 'next/image'
import { useState } from 'react'

const { Title } = Typography

const paymentMethods = [
  { label: 'Thanh toán khi nhận hàng', value: 'cod' },
  {
    label: (
      <Flex align="center" gap={10}>
        <div>Cổng thanh toán VNPay</div>
        <Image
          alt="vnpay logo"
          src="images/VNPay_Logo.png"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          className="w-12"
        />
      </Flex>
    ),
    value: 'vnpay',
  },
  {
    label: (
      <Flex align="center" gap={10}>
        <div>Cổng thanh toán PayOS (Quét mã QR)</div>
        <Image
          alt="payos logo"
          src="images/PayOS_Logo.png"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          className="w-12"
        />
      </Flex>
    ),
    value: 'payos',
    disabled: false,
  },
  { label: 'Momo', value: 'momo', disabled: true },
]

export default function ReceiverInfo() {
  const [paymentMethod, setPaymentMethod] = useState<string>('vnpay')

  const [province, setProvince] = useState<ProvinceType[]>([])
  const [district, setDistrict] = useState<DistrictType[]>([])
  const [ward, setWard] = useState<WardType[]>([])

  const onChangePaymentMethod = (e: RadioChangeEvent) => setPaymentMethod(e.target.value)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await ProvinceService.getProvince()

  //       const province = res.data.data?.results?.map((item: ProvinceType) => ({
  //         value: item.province_id,
  //         label: item.province_name,
  //       }))
  //       console.log(res)

  //       setProvince(province)
  //     } catch (error) {}
  //   }
  //   fetchData()
  // }, [])

  return (
    <div className="space-y-2">
      <Title level={3} className="uppercase text-sky-600">
        Thông tin nhận hàng
      </Title>
      <Form className="border p-4" layout="vertical" initialValues={{ paymentMethod: 'cod' }}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item<ReceiverFieldType>
            label="Tên người nhận"
            name="name"
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
          <Select options={province} size="large" placeholder="Chọn" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item<ReceiverFieldType>
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện.' }]}
          >
            <Select size="large" placeholder="Chọn" />
          </Form.Item>
          <Form.Item<ReceiverFieldType>
            label="Phường/Xã"
            name="ward"
            rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã.' }]}
          >
            <Select size="large" placeholder="Chọn" />
          </Form.Item>
        </div>
        <Form.Item<ReceiverFieldType>
          label="Địa chỉ cụ thể"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng.' }]}
        >
          <Input size="large" placeholder="Địa chỉ" />
        </Form.Item>
        <Form.Item<ReceiverFieldType> label="Ghi chú giao hàng" name="note">
          <Input.TextArea showCount rows={3} maxLength={500} size="large" placeholder="Ghi chú" />
        </Form.Item>
        <Form.Item<ReceiverFieldType>
          label="Chọn phương thức thanh toán"
          name="paymentMethod"
          rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán.' }]}
        >
          <Radio.Group value={paymentMethod} onChange={onChangePaymentMethod} size="large">
            <Space direction="vertical">
              {paymentMethods.map((item, i) => (
                <Radio key={i} value={item.value} disabled={item.disabled}>
                  {item.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item className="text-end">
          <Button htmlType="submit" size="large" type="primary" danger className="rounded-sm px-10">
            Đặt hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
