'use client'

import { ShoppingCartOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Carousel,
  CountdownProps,
  Divider,
  Flex,
  InputNumber,
  Rate,
  Statistic,
  Tabs,
  TabsProps,
  Image as AntdImage,
  App,
} from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { formatVND, toNextImageLink } from '~/utils/common'

const { Countdown } = Statistic

const detailItems = (
  description?: string,
  isShowMore?: boolean,
  setIsShowMore?: React.Dispatch<React.SetStateAction<boolean>>,
): TabsProps['items'] => [
  {
    key: '1',
    label: 'Chi tiết sản phẩm',
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-12">
          <div>Mô tả</div>
          <div className="col-span-11">
            {description
              ? description?.split('\n').length > 5 && !isShowMore
                ? description
                    ?.split('\n')
                    .slice(0, 5)
                    .map((row, i) => <div key={i}>{row}</div>)
                : description?.split('\n').map((row, i) => <div key={i}>{row}</div>)
              : 'Chưa có mô tả'}
            {description && description?.split('\n').length > 5 && (
              <Button
                type="link"
                className="p-0"
                onClick={() => {
                  setIsShowMore && setIsShowMore(!isShowMore)
                }}
              >
                {!isShowMore ? 'Xem thêm' : 'Thu gọn'}
              </Button>
            )}
          </div>
          {/* <pre className="col-span-11">{description ?? 'Chưa có mô tả'}</pre> */}
        </div>
        <div className="grid grid-cols-12">
          <div>Chất liệu</div>
          <div className="col-span-11">95% Polyester 5% Spandex</div>
        </div>
      </div>
    ),
  },
  { key: '2', label: 'Đánh giá sản phẩm', children: 'Chưa có đánh giá nào' },
]

type Selected = {
  colorId?: number
  sizeId?: number
  quantity: number
}

export default function Details({ product }: { product: ProductDetailsType | undefined }) {
  const { notification } = App.useApp()
  const [images, setImages] = useState<string[]>()
  const [currentImage, setCurrentImage] = useState<string | undefined>(product?.imageUrls[0])
  const [visible, setVisible] = useState(false)

  const [disabledColors, setDisabledColors] = useState<boolean[]>(
    product?.colorSizes.map(() => true) ?? [],
  )
  const [disabledSizes, setDisabledSizes] = useState<boolean[]>(
    product?.colorSizes[0].sizeInStocks.map(() => true) ?? [],
  )

  const [maxQuantity, setMaxQuantity] = useState<number>(0)

  const [isShowMore, setIsShowMore] = useState<boolean>(false)

  const [selected, setSelected] = useState<Selected>({ quantity: 1 })

  const [selectedError, setSelectedError] = useState<boolean>(false)

  useEffect(() => {
    const colorImages = product?.colorSizes.map((color) => color.imageUrl)
    setImages([...(product?.imageUrls ?? []), ...(colorImages ?? [])])
  }, [product])

  useEffect(() => {
    const max =
      product?.colorSizes
        .find((e) => e.id === selected?.colorId)
        ?.sizeInStocks.find((e) => e.sizeId === selected?.sizeId)?.inStock ?? 1
    if (selected.quantity && selected.quantity > max) {
      setSelected({ ...selected, quantity: max })
    }
    setMaxQuantity(max)
    if (selectedError) {
      setSelectedError(!checkSelectedComplete())
    }
  }, [selected.colorId, selected.sizeId])

  const onSelectColor = (colorId: number, imageUrl: string) => {
    setSelected({ ...selected, colorId: colorId })
    setCurrentImage(imageUrl)
    const color = product?.colorSizes.find((e) => e.id === colorId)
    if (color) {
      setDisabledSizes(color.sizeInStocks.map((size) => size.inStock > 0))
    }
  }

  const onSelectSize = (sizeId: number) => {
    setSelected({ ...selected, sizeId: sizeId })
    if (product) {
      const colors = product?.colorSizes.map((color) => {
        const size = color.sizeInStocks.find((e) => e.sizeId === sizeId)
        return size?.inStock > 0
      })
      setDisabledColors(colors)
    }
  }

  const onFinishFlashSale: CountdownProps['onFinish'] = () => {
    console.log('finished!')
  }

  const checkSelectedComplete = (): boolean => {
    return (
      selected.colorId !== undefined &&
      selected.sizeId !== undefined &&
      selected.quantity !== undefined &&
      selected.quantity > 0
    )
  }

  const addToCart = () => {
    const isComplete = checkSelectedComplete()
    if (isComplete) {
      notification.success({
        message: `Đã thêm ${selected.quantity} sản phẩm vào giỏ hàng`,
        className: 'text-green-500',
      })
      console.log('add to cart')
    } else setSelectedError(true)
  }

  if (product === undefined) throw new Error()

  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            {product.discountPercent > 0 ? (
              <Badge.Ribbon
                text={`-${product.discountPercent}%`}
                color="red"
                rootClassName="border bg-white drop-shadow-sm"
              >
                <Image
                  src={toNextImageLink(currentImage)}
                  alt="Product Image"
                  width={0}
                  height={0}
                  priority
                  sizes="100vw"
                  onClick={() => setVisible(true)}
                  quality={100}
                  className="h-[27rem] object-contain object-center w-full cursor-pointer"
                />
              </Badge.Ribbon>
            ) : (
              <Image
                src={toNextImageLink(currentImage)}
                alt="Product Image"
                width={0}
                height={0}
                priority
                sizes="100vw"
                onClick={() => setVisible(true)}
                quality={100}
                className="h-[27rem] object-contain object-center w-full border bg-white drop-shadow-sm cursor-pointer"
              />
            )}
            <Carousel
              dots={false}
              arrows
              infinite={false}
              slidesToShow={5}
              className="w-full h-16 px-4 border bg-gray-200 drop-shadow"
            >
              {images?.map((url, i) => (
                <div key={i} className="px-1 outline-none">
                  <Image
                    src={toNextImageLink(url)}
                    alt="Product Image"
                    width={0}
                    height={0}
                    onClick={() => setCurrentImage(url)}
                    sizes="100vw"
                    quality={75}
                    className={`w-full h-16 object-contain object-center cursor-pointer hover:border hover:border-red-500 ${
                      currentImage === url && 'border-2 border-red-500'
                    }`}
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="px-4 col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-2xl font-semibold">{product.name}</div>
              <div className="space-x-2">
                <Rate allowHalf disabled={true} value={4.5} />
                <span>4.5</span>
                <Divider type="vertical" />
                <span>Đã bán {product.sold}</span>
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
                <span className="text-red-600 text-3xl font-semibold">
                  {formatVND.format(
                    product.price - product.price * (product.discountPercent / 100),
                  )}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-gray-600 line-through text-lg">
                    {formatVND.format(product.price)}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className={`grid grid-cols-5 gap-4 px-6 py-2 ${selectedError && 'bg-gray-200'}`}>
                <div className="text-gray-500 text-base font-semibold">Màu</div>
                <div className="col-span-4 space-x-2">
                  {product.colorSizes.map((color, i) => (
                    <Button
                      key={i}
                      disabled={!disabledColors[i]}
                      // danger={selected.colorId === color.id}
                      type={selected.colorId === color.id ? 'primary' : 'default'}
                      onClick={() => onSelectColor(color.id, color.imageUrl)}
                      size="large"
                      className="rounded-sm"
                    >
                      {color.colorName}
                    </Button>
                  ))}
                </div>

                <div className="text-gray-500 text-base font-semibold">Kích cỡ</div>
                <div className="col-span-4 space-x-2">
                  {product.colorSizes[0]?.sizeInStocks?.map((size, i) => (
                    <Button
                      key={i}
                      disabled={!disabledSizes[i]}
                      type={selected.sizeId === size.sizeId ? 'primary' : 'default'}
                      onClick={() => onSelectSize(size.sizeId)}
                      className="rounded-sm"
                    >
                      {size.sizeName}
                    </Button>
                  ))}
                </div>

                <div className="text-gray-500 text-base font-semibold">Số lượng</div>
                <div className="col-span-4 space-x-2">
                  <InputNumber
                    className="rounded-sm"
                    size="large"
                    min={1}
                    max={maxQuantity}
                    value={selected.quantity}
                    onChange={(value) => setSelected({ ...selected, quantity: value ?? 1 })}
                  />
                  <span>
                    {selected.colorId &&
                      selected.sizeId &&
                      (product.colorSizes
                        .find((e) => e.id === selected.colorId)
                        ?.sizeInStocks.find((e) => e.sizeId === selected.sizeId)?.inStock || 0) +
                        ' sản phẩm có sẳn'}
                  </span>
                </div>

                {selectedError && (
                  <div className="text-red-500 col-span-5">Vui lòng chọn phân loại</div>
                )}
              </div>
              <Flex justify="end" className="space-x-4">
                <Button danger size="large" type="primary" className="rounded-sm p-6">
                  Mua ngay
                </Button>
                <Button danger onClick={addToCart} size="large" className="rounded-sm p-6">
                  <ShoppingCartOutlined />
                  <span>Thêm vào giỏ hàng</span>
                </Button>
              </Flex>
            </div>
          </div>
        </div>
        <AntdImage
          width={200}
          hidden
          preview={{
            visible,
            src: toNextImageLink(currentImage),
            onVisibleChange: (value) => setVisible(value),
          }}
        />
        <Tabs
          className="mt-4 border px-4 pb-4 bg-white"
          defaultActiveKey="1"
          type="line"
          size="large"
          items={detailItems(product.description, isShowMore, setIsShowMore)}
        />
      </div>
    </>
  )
}
