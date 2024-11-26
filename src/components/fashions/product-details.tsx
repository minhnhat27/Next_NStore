'use client'

import { ShoppingCartOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Carousel,
  CountdownProps,
  Divider,
  InputNumber,
  Rate,
  Statistic,
  Image as AntdImage,
  App,
  Result,
  Skeleton,
} from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BsFire } from 'react-icons/bs'
import useAuth from '~/hooks/useAuth'
import httpService from '~/lib/http-service'
import { CART_API, FASHION_API } from '~/utils/api-urls'
import { formatVND, showError, toNextImageLink } from '~/utils/common'
import Reviews from './reviews'
import Heart from '../ui/heart'

import useSWR, { mutate } from 'swr'

const { Countdown } = Statistic

interface Props {
  id: number
}

export default function Details({ id }: Props) {
  const { state } = useAuth()
  const router = useRouter()

  const { notification } = App.useApp()
  const [images, setImages] = useState<string[]>()
  const [visible, setVisible] = useState<boolean>(false)

  const {
    data: product,
    isLoading,
    error,
    mutate: productMutate,
  } = useSWR<ProductDetailsType>(id ? `${FASHION_API}/${id}` : undefined, httpService.get)

  const [currentImage, setCurrentImage] = useState<string>()

  const initCartItem: CartItemType = useMemo(() => ({ productId: id, quantity: 1 }), [id])

  const [disabledColors, setDisabledColors] = useState<boolean[]>([])
  const [disabledSizes, setDisabledSizes] = useState<boolean[]>([])

  const [maxQuantity, setMaxQuantity] = useState<number>(0)

  const [selected, setSelected] = useState<CartItemType>(initCartItem)
  const [selectedError, setSelectedError] = useState<boolean>(false)

  const [addCartLoading, setAddCartLoading] = useState<boolean>(false)

  const checkSelectedComplete = useCallback((): boolean => {
    return (
      selected.colorId !== undefined &&
      selected.sizeId !== undefined &&
      selected.quantity !== undefined &&
      selected.quantity > 0
    )
  }, [selected])

  useEffect(() => {
    if (product) {
      const colorImages = product.colorSizes.map((color) => color.imageUrl)
      setCurrentImage(product.imageUrls[0])
      setImages([...product.imageUrls, ...colorImages])

      setDisabledColors(product.colorSizes.map(() => true))
      setDisabledSizes(product.colorSizes[0].sizeInStocks.map(() => true))
    }
  }, [product])

  useEffect(() => {
    const max =
      product?.colorSizes
        .find((e) => e.id === selected?.colorId)
        ?.sizeInStocks.find((e) => e.sizeId === selected?.sizeId)?.inStock ?? 1

    if (selected.quantity && selected.quantity > max) {
      setSelected((prevSelected) => ({ ...prevSelected, quantity: max }))
    }
    setMaxQuantity(max)
    if (selectedError) setSelectedError(!checkSelectedComplete())
  }, [selected, product, checkSelectedComplete, selectedError])

  const onSelectColor = (colorId: number, imageUrl: string) => {
    setSelected((pre) => ({ ...pre, colorId: colorId }))
    setCurrentImage(imageUrl)
    const color = product?.colorSizes.find((e) => e.id === colorId)
    if (color) {
      setDisabledSizes(color.sizeInStocks.map((size) => size.inStock > 0))
    }
  }

  const onSelectSize = (sizeId: number) => {
    setSelected((pre) => ({ ...pre, sizeId: sizeId }))
    if (product) {
      const colors = product?.colorSizes.map((color) => {
        const size = color.sizeInStocks.find((e) => e.sizeId === sizeId)
        return size?.inStock > 0
      })
      setDisabledColors(colors)
    }
  }

  const addToCart = async (isBuyNow = false) => {
    if (!state.isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search

      notification.info({
        message: 'Bạn chưa đăng nhập',
        description: (
          <>
            <div>Vui lòng đăng nhập để thêm sản phẩm</div>
            <Button
              type="link"
              onClick={() => {
                notification.destroy('cartToLogin')
                router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
              }}
              className="px-0"
            >
              Đăng nhập ngay
            </Button>
          </>
        ),
        key: 'cartToLogin',
        className: 'text-sky-500',
      })
      return
    }

    const isComplete = checkSelectedComplete()
    if (isComplete) {
      try {
        setAddCartLoading(true)
        await httpService.post(CART_API, selected)

        mutate([`${CART_API}`, state.userInfo?.session])
        mutate([`${CART_API}/count`, state.userInfo?.session])

        setSelected(initCartItem)
        setDisabledColors(product?.colorSizes.map(() => true) ?? [])
        setDisabledSizes(product?.colorSizes[0].sizeInStocks.map(() => true) ?? [])

        isBuyNow
          ? router.push(`/cart?id=${id}`)
          : notification.success({
              message: 'Thành công',
              description: (
                <>
                  <div>Đã thêm sản phẩm vào giỏ hàng</div>
                  <Link href="/cart">
                    <Button
                      type="link"
                      onClick={() => notification.destroy('addToCart')}
                      className="px-0"
                    >
                      Xem giỏ hàng
                    </Button>
                  </Link>
                </>
              ),
              key: 'addToCart',
              className: 'text-green-500',
            })
      } catch (error: any) {
        notification.error({
          message: 'Thất bại',
          description: showError(error),
          className: 'text-red-500',
        })
        setSelected(initCartItem)
      } finally {
        setAddCartLoading(false)
      }
    } else setSelectedError(true)
  }

  // const endFlashSale = useMemo((): number | undefined => {
  //   const hours = new Date().getHours()
  //   const endFlashSale = new Date()

  //   if (hours >= 0 && hours < 2) {
  //     endFlashSale.setHours(1, 59, 59, 999)
  //     return endFlashSale.getTime()
  //   } else if (hours >= 10 && hours < 12) {
  //     endFlashSale.setHours(11, 59, 59, 999)
  //     return endFlashSale.getTime()
  //   } else if (hours >= 19 && hours < 22) {
  //     endFlashSale.setHours(21, 59, 59, 999)
  //     return endFlashSale.getTime()
  //   }

  //   return undefined
  // }, [product])

  const maxDiscountPercent = useMemo(
    () => product?.flashSaleDiscountPercent || product?.discountPercent || 0,
    [product?.discountPercent, product?.flashSaleDiscountPercent],
  )

  const onFinishFlashSale: CountdownProps['onFinish'] = () => {
    product && productMutate({ ...product, flashSaleDiscountPercent: 0 })
  }

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
          <Skeleton.Image className="h-96 w-full" active />
          <Skeleton className="md:col-span-2" active paragraph={{ rows: 16 }} />
        </div>
      </>
    )
  }

  if (error)
    return (
      <Result
        status={404}
        title="Không tìm thấy sản phẩm"
        extra={
          <Button type="primary" onClick={router.back}>
            Quay lại
          </Button>
        }
      />
    )

  if (product) {
    return (
      <>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex flex-col gap-2">
              {currentImage &&
                (maxDiscountPercent > 0 ? (
                  <Badge.Ribbon
                    text={`-${maxDiscountPercent}%`}
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
                ))}
              <Carousel
                dots={false}
                arrows
                infinite={false}
                slidesToShow={5}
                responsive={[
                  { breakpoint: 480, settings: { slidesToShow: 5 } },
                  { breakpoint: 768, settings: { slidesToShow: 6 } },
                  { breakpoint: 1024, settings: { slidesToShow: 4 } },
                ]}
                className="h-16 px-4 border bg-gray-200 drop-shadow"
              >
                {images &&
                  currentImage &&
                  images.map((url, i) => (
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
            <div className="md:px-4 md:col-span-2 flex flex-col gap-2 ">
              <div className="text-2xl font-semibold line-clamp-2">{product.name}</div>
              <div className="flex items-center gap-2">
                <Rate allowHalf disabled={true} value={product.rating} />
                <div>{product?.rating}</div>
                <Divider type="vertical" />
                <div>Đã bán {product?.sold}</div>
                <Divider type="vertical" />
                <Heart productId={product?.id} label />
              </div>
              {product.flashSaleDiscountPercent ? (
                <div className="border">
                  <div className="flex justify-between items-center text-xl rounded-sm bg-gradient-to-r from-red-700 to-red-500 text-white py-1 px-2">
                    <div className="flex items-center gap-2">
                      <BsFire className="text-lg md:text-2xl text-orange-500" />
                      <div>Flash Sale</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm md:text-lg">Kết thúc trong</div>
                      <Countdown
                        className="animate-pulse"
                        // value={new Date().getTime() + 5 * 1000}
                        value={new Date(product.endFlashSale).getTime()}
                        onFinish={onFinishFlashSale}
                        valueStyle={{ color: 'white' }}
                        // format="mm:ss"
                      />
                    </div>
                  </div>
                  <div className="space-x-2 p-6 bg-gray-200">
                    <span className="text-red-600 text-3xl font-semibold">
                      {formatVND.format(product.price - product.price * (maxDiscountPercent / 100))}
                    </span>
                    <span className="text-gray-600 line-through text-lg">
                      {formatVND.format(product.price)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-x-2 p-6 bg-gray-200">
                  <span className="text-red-600 text-3xl font-semibold">
                    {formatVND.format(product.price - product.price * (maxDiscountPercent / 100))}
                  </span>
                  {!maxDiscountPercent || (
                    <span className="text-gray-600 line-through text-lg">
                      {formatVND.format(product.price)}
                    </span>
                  )}
                </div>
              )}
              <div className="flex-1 place-content-end">
                <div
                  className={`grid grid-cols-5 mb-2 gap-2 md:px-6 py-2 ${
                    selectedError && 'bg-red-50 border border-red-400'
                  }`}
                >
                  <div className="text-gray-500 text-base font-semibold">Màu</div>
                  <div className="col-span-4">
                    {product?.colorSizes.map((color, i) => (
                      <Button
                        key={i}
                        disabled={!disabledColors[i]}
                        // danger={selected.colorId === color.id}
                        type={selected.colorId === color.id ? 'primary' : 'default'}
                        onClick={() => onSelectColor(color.id, color.imageUrl)}
                        size="large"
                        className="rounded-sm m-1"
                      >
                        {color.colorName}
                      </Button>
                    ))}
                  </div>
                  <div className="text-gray-500 text-base font-semibold">Kích cỡ</div>
                  <div className="col-span-4">
                    {product?.colorSizes[0]?.sizeInStocks?.map((size, i) => (
                      <Button
                        key={i}
                        disabled={!disabledSizes[i]}
                        type={selected.sizeId === size.sizeId ? 'primary' : 'default'}
                        onClick={() => onSelectSize(size.sizeId)}
                        className="rounded-sm m-1"
                      >
                        {size.sizeName}
                      </Button>
                    ))}
                  </div>
                  <div className="text-gray-500 text-base font-semibold">Số lượng</div>
                  <div className="col-span-4 space-x-2">
                    <InputNumber
                      className="rounded-sm m-1"
                      size="large"
                      min={1}
                      max={maxQuantity}
                      value={selected.quantity}
                      onChange={(value) => setSelected({ ...selected, quantity: value ?? 1 })}
                    />
                    <span>
                      {selected.colorId &&
                        selected.sizeId &&
                        (product?.colorSizes
                          .find((e) => e.id === selected.colorId)
                          ?.sizeInStocks.find((e) => e.sizeId === selected.sizeId)?.inStock || 0) +
                          ' sản phẩm có sẳn'}
                    </span>
                  </div>
                  {selectedError && (
                    <div className="text-red-500 col-span-5">Vui lòng chọn phân loại</div>
                  )}
                </div>
                <div className="flex justify-end items-end gap-2">
                  <Button
                    onClick={() => addToCart(true)}
                    loading={addCartLoading}
                    danger
                    size="large"
                    type="primary"
                    className="rounded-sm p-6"
                  >
                    Mua ngay
                  </Button>
                  <Button
                    danger
                    onClick={() => addToCart()}
                    loading={addCartLoading}
                    size="large"
                    className="rounded-sm p-6"
                  >
                    <ShoppingCartOutlined />
                    <span className="hidden xs:flex">Thêm vào giỏ hàng</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {currentImage && (
            <AntdImage
              width={0}
              hidden
              preview={{
                visible,
                src: toNextImageLink(currentImage),
                onVisibleChange: (value) => setVisible(value),
              }}
            />
          )}
          {product && <Reviews product={product} />}
        </div>
      </>
    )
  }
}
