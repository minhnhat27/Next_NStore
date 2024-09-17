'use client'

import { DeleteFilled, DropboxOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Flex,
  InputNumber,
  Popconfirm,
  Radio,
  RadioChangeEvent,
  Result,
  Skeleton,
  Space,
  Steps,
  Table,
  TableProps,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { formatVND, shippingPrice, showError, toNextImageLink } from '~/utils/common'
import Link from 'next/link'
import Image from 'next/image'
import httpService from '~/lib/http-service'
import { CART_API } from '~/utils/api-urls'
import useAuth from '~/hooks/useAuth'
import ChooseSize from './choose-size'
import ChangeAddress from './change-address'
import ChooseVoucher from './choose-voucher'
import useSWR from 'swr'
import debounce from 'debounce'
import useSWRImmutable from 'swr/immutable'

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
          className="w-8"
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
          className="w-8"
        />
      </Flex>
    ),
    value: 'payos',
  },
  { label: 'Momo', value: 'momo', disabled: true },
]

const columns = (
  checkedItems: CartItemsType[],
  cartItems: CartItemsType[],
  onCheckCartItems: (item: CartItemsType) => void,
  onCheckAllChange: CheckboxProps['onChange'],
  onChangeQuantity: (item: CartItemsType, value: number | null) => Promise<void>,
  onChangeSize: (item: CartItemsType, value: number) => Promise<void>,
  handleDeleteCartItem: (id: string) => void,
  hanldeChangeQuantity: debounce.DebouncedFunction<
    (item: CartItemsType, value: number | null) => Promise<void>
  >,
): TableProps<CartItemsType>['columns'] => [
  {
    title: (
      <Checkbox
        key="checkall"
        checked={cartItems.length === checkedItems.length}
        indeterminate={checkedItems.length > 0 && checkedItems.length < cartItems.length}
        onChange={onCheckAllChange}
      />
    ),
    className: 'px-2',
    render: (_, item) => (
      <Checkbox
        onChange={() => onCheckCartItems(item)}
        checked={checkedItems.some((e) => e.id === item.id)}
      />
    ),
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'imageUrl',
    render: (value, _, index) => (
      <Image
        alt="product"
        className="transition-all w-24 h-auto"
        width={0}
        height={0}
        priority={index < 3}
        sizes="100vw"
        quality={50}
        src={toNextImageLink(value)}
      />
    ),
    colSpan: 2,
    onCell: () => ({ colSpan: 2 }),
  },
  {
    dataIndex: 'productName',
    render: (value) => <div className="line-clamp-2">{value}</div>,
  },
  {
    title: 'Phân loại',
    dataIndex: 'colorName',
    align: 'center',
    render: (value, item) => (
      <div className="font-semibold text-gray-500 flex justify-end items-center text-nowrap">
        <span>{value} - </span>
        <ChooseSize cartItems={cartItems} item={item} onChangeSize={onChangeSize} />
      </div>
    ),
  },
  {
    title: 'Đơn giá',
    dataIndex: 'price',
    align: 'center',
    render: (price, item) => (
      <>
        {item.discountPercent > 0 && (
          <div className="line-through text-gray-400">{formatVND.format(item.originPrice)}</div>
        )}
        <div className="font-semibold"> {formatVND.format(price)}</div>
      </>
    ),
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    align: 'center',
    render: (quantity, item) => (
      <InputNumber
        className="w-16 rounded-sm"
        min={1}
        max={item.sizeInStocks.find((e) => e.sizeId === item?.sizeId)?.inStock}
        value={quantity}
        onChange={(value) => {
          onChangeQuantity(item, value)
          hanldeChangeQuantity(item, value)
        }}
      />
    ),
  },
  {
    title: 'Tổng',
    dataIndex: 'price',
    align: 'center',
    className: 'w-36',
    render: (price, item) => (
      <div className="text-red-600 text-lg font-semibold p-1">
        {formatVND.format(price * item.quantity)}
      </div>
    ),
  },
  {
    title: 'Thao tác',
    dataIndex: 'id',
    align: 'center',
    render: (id) => (
      <Popconfirm
        okButtonProps={{ danger: true }}
        onConfirm={() => handleDeleteCartItem(id)}
        title="Xóa sản phẩm này"
        key="delete"
      >
        <Button type="text" className="text-red-500 hover:text-red-400 px-3" key="delete">
          <DeleteFilled className="text-lg" />
        </Button>
      </Popconfirm>
    ),
  },
]

interface TotalType {
  originTotal: number
  discount: number
  voucher: number
  shipping: number
  total: () => number
}

const initTotal: TotalType = {
  originTotal: 0,
  discount: 0,
  voucher: 0,
  shipping: 0,
  total: function () {
    return this.originTotal - this.discount - this.voucher + this.shipping
  },
}

export default function CartDetails() {
  const { state } = useAuth()
  const session = state.userInfo?.session

  const { notification } = App.useApp()

  const [cartItems, setCartItems] = useState<CartItemsType[]>([])
  const [checkedItems, setCheckedItems] = useState<CartItemsType[]>([])

  const [voucher, setVoucher] = useState<VoucherType>()

  const [total, setTotal] = useState<TotalType>(initTotal)

  const [paymentMethod, setPaymentMethod] = useState<string>('cod')

  const onChangePaymentMethod = (e: RadioChangeEvent) => setPaymentMethod(e.target.value)

  const { data, isLoading } = useSWRImmutable<CartItemsType[]>(
    [CART_API, session],
    ([url, session]) => httpService.getWithSession(url, session),
  )

  useEffect(() => {
    if (data) setCartItems(data)
  }, [data])

  const calcPrice = useCallback(
    (newCheckedItems: CartItemsType[], voucherCalc?: VoucherType) => {
      const { originPrice, discount } = newCheckedItems.reduce(
        (preValue, item) => {
          const quantity = item.quantity
          preValue.originPrice += item.originPrice * quantity
          preValue.discount += item.originPrice * (item.discountPercent / 100) * quantity

          return preValue
        },
        { originPrice: 0, discount: 0 },
      )

      const price = originPrice - discount

      const shippingCost = shippingPrice(price)

      let voucherDiscount = 0

      if (voucherCalc && voucherCalc.minOrder <= price) {
        if (voucherCalc.discountPercent)
          voucherDiscount = price * (voucherCalc.discountPercent / 100)
        else if (voucherCalc.discountAmount) voucherDiscount = voucherCalc.discountAmount

        if (voucherDiscount > voucherCalc.maxDiscount) {
          voucherDiscount = voucherCalc.maxDiscount
        }
      }

      setTotal((prevTotal) => ({
        ...prevTotal,
        originTotal: originPrice,
        discount: discount,
        shipping: shippingCost,
        voucher: voucherDiscount,
      }))
    },
    [shippingPrice, voucher],
  )

  const handleUpdateCartItem = async (id: string, dataUpdate: UpdateCartItem) => {
    try {
      await httpService.put(`${CART_API}/${id}`, dataUpdate)
    } catch (error) {
      console.error('Failed to update size:', error)
    }
  }

  const onChangeSize = async (item: CartItemsType, newSizeId: number): Promise<void> => {
    const inStock = item.sizeInStocks.find((x) => x.sizeId === newSizeId)?.inStock

    let newQuantity = item.quantity
    if (inStock && newQuantity > inStock) {
      newQuantity = inStock
    }
    const dataUpdate: UpdateCartItem = {
      sizeId: newSizeId,
      quantity: newQuantity,
    }
    await handleUpdateCartItem(item.id, dataUpdate)

    const updatedCart = cartItems.map((e) =>
      e.id === item.id ? { ...e, sizeId: newSizeId, quantity: newQuantity } : e,
    )

    setCartItems(updatedCart)
  }

  const hanldeChangeQuantity = useCallback(
    debounce(async (item: CartItemsType, value: number | null): Promise<void> => {
      if (value) {
        const dataUpdate: UpdateCartItem = {
          sizeId: item.sizeId,
          quantity: value,
        }

        await handleUpdateCartItem(item.id, dataUpdate)
      }
    }, 500),
    [],
  )

  const onChangeQuantity = async (item: CartItemsType, value: number | null): Promise<void> => {
    if (value) {
      const updatedCart = cartItems.map((e) => {
        if (e.id === item.id) {
          return { ...e, quantity: value }
        }
        return e
      })

      if (checkedItems.length > 0) {
        const updatedChecked = updatedCart.filter((e) =>
          checkedItems.some((checkedItem) => checkedItem.id === e.id),
        )
        calcPrice(updatedChecked, voucher)
      }
      setCartItems(updatedCart)
    }
  }

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    if (cartItems && e.target.checked) {
      calcPrice(cartItems, voucher)
      setCheckedItems(cartItems)
    } else {
      setTotal(initTotal)
      setCheckedItems([])
    }
  }

  const onCheckCartItems = (item: CartItemsType) => {
    const exist = checkedItems.find((e) => e.id === item.id)
    const newList = exist
      ? checkedItems.filter((e) => !(e.id === item.id))
      : [...checkedItems, item]

    calcPrice(newList, voucher)
    setCheckedItems(newList)
  }

  const handleDeleteCartItem = async (id: string) => {
    try {
      await httpService.del(`${CART_API}/${id}`)
      setCartItems(cartItems.filter((e) => e.id !== id))

      const checkedCartItems = checkedItems.filter((e) => e.id !== id)
      setCheckedItems(checkedCartItems)
      calcPrice(checkedCartItems, voucher)
    } catch (error: any) {
      notification.error({
        message: 'Xóa giỏ hàng thất bại',
        description: showError(error),
        className: 'text-red-500',
      })
    }
  }

  const onChooseVoucher = (selected?: VoucherType): boolean => {
    if (!selected) {
      setVoucher(undefined)
    } else {
      const today = new Date()
      if (selected.endDate < today) return false
      if (total.originTotal - total.discount < selected.minOrder) return false

      setVoucher(selected)
    }
    calcPrice(checkedItems, selected)
    return true
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />

  return (
    <>
      {cartItems && cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 col-span-2">
            <Steps
              className="border px-4 pt-3 pb-2"
              size="small"
              direction="horizontal"
              current={
                total.originTotal - total.discount >= 400000
                  ? 2
                  : total.originTotal - total.discount >= 200000
                  ? 1
                  : 0
              }
              items={[
                {
                  title: '30.000đ',
                  description: 'Dưới 200.000đ',
                },
                {
                  title: '10.000đ',
                  description: 'Từ 200.000 đến dưới 400.000đ',
                },
                {
                  title: 'Miễn phí vận chuyển',
                  description: 'Từ 400.000đ',
                },
              ]}
            />
            <div className="px-2 border">
              <Table
                dataSource={cartItems}
                columns={columns(
                  checkedItems,
                  cartItems,
                  onCheckCartItems,
                  onCheckAllChange,
                  onChangeQuantity,
                  onChangeSize,
                  handleDeleteCartItem,
                  hanldeChangeQuantity,
                )}
                className="overflow-x-auto"
                pagination={false}
                rowKey={(item) => item.id}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="border py-4 px-6 space-y-2 drop-shadow-sm">
              <ChangeAddress />
              <div>
                <Divider className="my-4" />
              </div>
              <div className="columns-2">
                <div>
                  <span className="font-semibold">Tổng tiền </span>
                  <span className="text-gray-400 text-xs">({checkedItems.length} sản phẩm)</span>
                </div>
                <div className="text-end">{formatVND.format(total.originTotal)}</div>
              </div>
              <div className="columns-2">
                <div className="font-semibold">Giảm giá</div>
                <div className="text-end">{formatVND.format(total.discount)}</div>
              </div>
              <div className="columns-2">
                <div className="font-semibold">Mã giảm giá</div>
                <div className="text-end">{formatVND.format(total.voucher)}</div>
              </div>
              <div className="columns-2">
                <div className="font-semibold">Phí vận chuyển</div>
                <div className="text-end">{formatVND.format(total.shipping)}</div>
              </div>
              <div>
                <Divider className="my-4" />
              </div>
              <ChooseVoucher
                session={session}
                cartPrice={total.originTotal - total.discount}
                voucher={voucher}
                onChooseVoucher={onChooseVoucher}
              />
              <div>
                <Divider className="my-4" />
              </div>
              <div className="columns-2">
                <div className="font-bold">Tổng thanh toán</div>
                <div className="text-end text-red-600 font-semibold text-2xl">
                  {formatVND.format(total.total())}
                </div>
              </div>
            </div>
            <div className="border py-4 px-6 drop-shadow-sm">
              <Radio.Group value={paymentMethod} onChange={onChangePaymentMethod} size="large">
                <Space direction="vertical">
                  {paymentMethods.map((item, i) => (
                    <Radio key={i} value={item.value} disabled={item.disabled}>
                      {item.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            <Button
              htmlType="submit"
              size="large"
              type="primary"
              danger
              disabled={checkedItems.length <= 0}
              className="rounded-none w-full"
            >
              {paymentMethod !== 'cod' ? 'Tiến hành thanh toán' : 'Đặt hàng'}
            </Button>
          </div>
        </div>
      ) : (
        <Result
          icon={<DropboxOutlined className="text-sky-600 text-[10rem]" />}
          title="Bạn chưa chọn sản phẩm nào"
          subTitle="Hãy nhanh tay chọn ngay sản phẩm yêu thích."
          extra={
            <Link href="fashions">
              <Button type="primary">Mua sắm ngay</Button>
            </Link>
          }
        />
      )}
    </>
  )
}
