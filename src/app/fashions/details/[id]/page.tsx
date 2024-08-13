'use client'

import { ShoppingCartOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Carousel,
  CountdownProps,
  Divider,
  Flex,
  Image,
  InputNumber,
  Rate,
  Statistic,
  Tabs,
  TabsProps,
  Typography,
} from 'antd'
import React, { useState } from 'react'

const { Title } = Typography
const { Countdown } = Statistic

const detailItems: TabsProps['items'] = [
  {
    key: '1',
    label: 'Chi tiết sản phẩm',
    children: (
      <>
        <div className="grid grid-cols-12">
          <div>Mô tả</div>
          <div className="col-span-11">
            Mô tả sản phẩm Chất liệu: Vải Pique Thành phần: 95% Polyester 5% Spandex - Co giãn 4
            chiều - Hạn chế xù lông - Thoáng khí + Họa tiết: In dẻo Mô tả sản phẩm Chất liệu: Vải
            Pique Thành phần: 95% Polyester 5% Spandex - Co giãn 4 chiều - Hạn chế xù lông - Thoáng
            khí + Họa tiết: In dẻo Mô tả sản phẩm Chất liệu: Vải Pique Thành phần: 95% Polyester 5%
            Spandex - Co giãn 4 chiều - Hạn chế xù lông - Thoáng khí + Họa tiết: In dẻo
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div>Chất liệu</div>
          <div className="col-span-11">95% Polyester 5% Spandex</div>
        </div>
      </>
    ),
  },
  { key: '2', label: 'Đánh giá sản phẩm', children: 'Chưa có đánh giá nào' },
]

const ProductDetails: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string>('/images/product.png')

  const onFinishFlashSale: CountdownProps['onFinish'] = () => {
    console.log('finished!')
  }
  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-3">
          <div className="space-y-2">
            <Badge.Ribbon text="-20%" color="red" rootClassName="flex">
              <Image
                rootClassName="h-[27rem] w-full"
                className="object-cover object-center h-full w-full"
                src={currentImage}
              />
            </Badge.Ribbon>
            {/* <Image
              rootClassName="h-80 w-full"
              className="object-cover object-center h-full w-full"
              src="/images/product.png"
            /> */}
            <Carousel arrows dots={false} centerMode slidesToShow={4} className="w-full">
              <Image
                rootClassName="w-16 outline-none"
                onClick={() => setCurrentImage('/images/product.png')}
                className="object-cover object-center h-20 px-1 cursor-pointer hover:border hover:border-red-700"
                src="/images/product.png"
                preview={false}
              />
              <Image
                rootClassName="w-16 outline-none"
                onClick={() => setCurrentImage('/images/Banner.png')}
                className="object-cover object-center h-20 px-1 cursor-pointer hover:border hover:border-red-700"
                src="/images/Banner.png"
                preview={false}
              />
              <Image
                rootClassName="w-16 outline-none"
                onClick={() => setCurrentImage('/images/product.png')}
                className="object-cover object-center h-20 px-1 cursor-pointer hover:border hover:border-red-700"
                src="/images/product.png"
                preview={false}
              />
              <Image
                rootClassName="w-16 outline-none"
                onClick={() => setCurrentImage('/images/product.png')}
                className="object-cover object-center h-20 px-1 cursor-pointer hover:border hover:border-red-700"
                src="/images/product.png"
                preview={false}
              />
              <Image
                rootClassName="w-16 outline-none"
                onClick={() => setCurrentImage('/images/product.png')}
                className="object-cover object-center h-20 px-1 cursor-pointer hover:border hover:border-red-700"
                src="/images/product.png"
                preview={false}
              />
            </Carousel>
          </div>
          <div className="p-4 col-span-2 space-y-4">
            <Title level={3}>Sản phẩm ABC có 1 0 2</Title>
            <div className="space-x-2">
              <Rate allowHalf disabled={true} value={4.5} />
              <span>4.5</span>
              <Divider type="vertical" />
              <span>Đã bán 30</span>
            </div>
            <Flex
              justify="space-between"
              align="center"
              className="text-xl rounded-sm bg-gradient-to-r from-red-700 to-red-500 text-white p-2"
            >
              <div className="uppercase">Flash Sale</div>
              <Flex align="center" className="space-x-2">
                <div className="text-lg">Kết thúc trong</div>
                <Countdown
                  className="animate-pulse"
                  value={Date.now() + 1000 * 60 * 30}
                  onFinish={onFinishFlashSale}
                  valueStyle={{ color: 'white' }}
                />
              </Flex>
            </Flex>
            <div className="space-x-2">
              <span className="text-red-600 text-3xl">80.000đ</span>
              <span className="text-gray-600 line-through text-lg">80.000đ</span>
            </div>
            <div className="grid grid-cols-5 gap-6">
              <Title level={5} className="text-gray-500">
                Chọn màu
              </Title>
              <div className="col-span-4 grid grid-cols-7 gap-2">
                <Button size="large" className="rounded-sm border-blue-500 text-blue-500">
                  Đen
                </Button>
                <Button size="large" className="rounded-sm">
                  Xanh đen
                </Button>
                <Button size="large" className="rounded-sm">
                  Xanh rêu
                </Button>
                <Button size="large" className="rounded-sm">
                  Trắng
                </Button>
                <Button size="large" className="rounded-sm">
                  Đen
                </Button>
                <Button size="large" className="rounded-sm">
                  Trắng
                </Button>
              </div>

              <Title level={5} className="text-gray-500">
                Chọn kích cỡ
              </Title>
              <div className="col-span-4 grid grid-cols-12 gap-2">
                <Button className="rounded-sm border-blue-500 text-blue-500">XS</Button>
                <Button className="rounded-sm">S</Button>
                <Button className="rounded-sm">M</Button>
                <Button className="rounded-sm">L</Button>
                <Button className="rounded-sm">XL</Button>
                <Button className="rounded-sm">XXL</Button>
              </div>

              <Title level={5} className="text-gray-500">
                Số lượng
              </Title>
              <div className="col-span-4 space-x-2">
                <InputNumber
                  className="rounded-sm"
                  size="large"
                  min={1}
                  max={100000}
                  defaultValue={1}
                />
                <span>24 sản phẩm có sẳn</span>
              </div>
            </div>
            <Flex justify="end" className="pt-10 space-x-4">
              <Button danger size="large" type="primary" className="rounded-sm p-6">
                Mua ngay
              </Button>
              <Button danger size="large" className="rounded-sm p-6">
                <ShoppingCartOutlined />
                <span>Thêm vào giỏ hàng</span>
              </Button>
            </Flex>
          </div>
        </div>
        <Tabs
          className="mt-8 mb-2 border p-4"
          defaultActiveKey="1"
          type="card"
          size="large"
          items={detailItems}
        />
      </div>
    </>
  )
}
export default ProductDetails
