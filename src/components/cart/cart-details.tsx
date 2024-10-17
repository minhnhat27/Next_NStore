'use client'

import {
  DeleteFilled,
  DropboxOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons'
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
import { ACCOUNT_API, CART_API, ORDER_API, PAYMENT_API } from '~/utils/api-urls'
import useAuth from '~/hooks/useAuth'
import ChooseSize from './choose-size'
import ChangeAddress from './change-address'
import ChooseVoucher from './choose-voucher'
import debounce from 'debounce'
import useSWRImmutable from 'swr/immutable'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import useSWR, { mutate } from 'swr'

interface IProps {
  paymentMethods: PaymentMethod[]
}

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
    render: (value) => <div className="min-w-16 line-clamp-2">{value}</div>,
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
  price: () => number
  total: () => number
}

const initTotal: TotalType = {
  originTotal: 0,
  discount: 0,
  voucher: 0,
  shipping: 0,
  price: function () {
    return this.originTotal - this.discount
  },
  total: function () {
    return this.originTotal - this.discount - this.voucher + this.shipping
  },
}

export default function CartDetails({ paymentMethods }: IProps) {
  const { state } = useAuth()
  const session = state.userInfo?.session

  const router = useRouter()

  const { notification, modal } = App.useApp()

  const [cartItems, setCartItems] = useState<CartItemsType[]>([])
  const [checkedItems, setCheckedItems] = useState<CartItemsType[]>([])

  const [voucher, setVoucher] = useState<VoucherType>()
  const [total, setTotal] = useState<TotalType>(initTotal)

  const [paymentMethodId, setPaymentMethodId] = useState<number | undefined>(
    paymentMethods.at(0)?.id,
  )

  const onChangePaymentMethod = (e: RadioChangeEvent) => setPaymentMethodId(e.target.value)

  const {
    data,
    isLoading,
    mutate: cart_mutate,
  } = useSWR<CartItemsType[]>([CART_API, session], ([url, session]) =>
    httpService.getWithSession(url, session),
  )

  const {
    data: address,
    isLoading: address_loading,
    mutate: address_mutate,
  } = useSWRImmutable<AddressType>([ACCOUNT_API + '/address', session], ([url, session]) =>
    httpService.getWithSession(url, session),
  )

  const [addressError, setAddressError] = useState<boolean>(false)

  useEffect(() => setAddressError(false), [address])

  const sendCreateOrder = async (url: string, { arg }: { arg: any }) => httpService.post(url, arg)

  const {
    // data: createOrderResponse,
    isMutating: isMutatingCreateOrder,
    trigger: createOrderTrigger,
  } = useSWRMutation(ORDER_API, sendCreateOrder)

  const calcPrice = useCallback(
    (newCheckedItems: CartItemsType[]) => {
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

      if (voucher && voucher.minOrder <= price) {
        if (voucher.discountPercent) voucherDiscount = price * (voucher.discountPercent / 100)
        else if (voucher.discountAmount) voucherDiscount = voucher.discountAmount

        if (voucherDiscount > voucher.maxDiscount) {
          voucherDiscount = voucher.maxDiscount
        }
      }
      if (voucher && price < voucher.minOrder) {
        notification.warning({
          message: 'Đã hủy voucher không thể áp dụng',
          className: 'text-yellow-500',
        })
        setVoucher(undefined)
      }

      setTotal((prevTotal) => ({
        ...prevTotal,
        originTotal: originPrice,
        discount: discount,
        shipping: shippingCost,
        voucher: voucherDiscount,
      }))
    },
    [voucher, notification],
  )

  useEffect(() => {
    if (data) setCartItems(data)
  }, [data])

  useEffect(() => {
    setCheckedItems((pre) =>
      cartItems.filter((checkedItem) => pre.some((cartItem) => cartItem.id === checkedItem.id)),
    )
  }, [cartItems])

  useEffect(() => {
    calcPrice(checkedItems)
  }, [checkedItems, voucher, calcPrice])

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
      setCartItems(updatedCart)
    }
  }

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    if (cartItems && e.target.checked) setCheckedItems(cartItems)
    else setCheckedItems([])
  }

  const onCheckCartItems = (item: CartItemsType) => {
    const exist = checkedItems.find((e) => e.id === item.id)
    const newList = exist
      ? checkedItems.filter((e) => !(e.id === item.id))
      : [...checkedItems, item]

    setCheckedItems(newList)
  }

  const handleDeleteCartItem = async (id: string) => {
    try {
      await httpService.del(`${CART_API}/${id}`)
      const newCart = cartItems.filter((e) => e.id !== id)
      setCartItems(newCart)

      mutate([`${CART_API}/count`, state.userInfo?.session], newCart.length)
      cart_mutate(newCart)
    } catch (error: any) {
      notification.error({
        message: 'Xóa giỏ hàng thất bại',
        description: showError(error),
        className: 'text-red-500',
      })
    }
  }

  const onChooseVoucher = (selected?: VoucherType): boolean => {
    if (!selected) setVoucher(undefined)
    else {
      const today = new Date()
      if (selected.endDate < today) return false
      if (total.originTotal - total.discount < selected.minOrder) return false

      setVoucher(selected)
    }
    return true
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

  const handleCreateOrder = async () => {
    try {
      const hasEmptyField = !address || (address && Object.values(address).some((value) => !value))

      if (hasEmptyField) {
        setAddressError(true)
        return
      }

      if (paymentMethodId && address.districtID && address.wardID) {
        const delivery = [
          address.detail,
          address.wardName,
          address.districtName,
          address.provinceName,
        ].join(', ')

        const receiver = [address.name, address.phoneNumber].join(', ')

        const order: CreateOrderType = {
          total: total.total(),
          shippingCost: total.shipping,
          code: voucher?.code,
          paymentMethodId: paymentMethodId,
          receiver: receiver,
          deliveryAddress: delivery,
          cartIds: checkedItems.map((item) => item.id),
          wardID: address.wardID.toString(),
          districtID: address.districtID,
        }

        const url = await createOrderTrigger(order)
        // const url = await httpService.post(ORDER_API, order)
        mutate([`${CART_API}/count`, state.userInfo?.session])

        const paymentMethodName = paymentMethods.find((e) => e.id === paymentMethodId)?.name

        if (paymentMethodName && paymentMethodName.toUpperCase() != 'COD') {
          router.push(url)
        } else {
          notification.success({
            message: 'Đặt hàng thành công',
            description: 'Vui lòng kiểm tra lại đơn hàng của bạn',
            className: 'text-green-500',
          })
          router.replace('/account/purchase')
        }
      } else {
        notification.error({
          message: 'Đặt hàng thất bại',
          description: 'Vui lòng chọn phương thức thanh toán',
          className: 'text-red-500',
        })
      }
    } catch (error: any) {
      notification.error({
        message: 'Đặt hàng thất bại',
        description: showError(error),
        className: 'text-red-500',
      })
    }
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />

  return (
    <>
      {cartItems && cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          <div className="space-y-2 md:col-span-2">
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
              {address_loading ? (
                <Skeleton active />
              ) : (
                <>
                  <ChangeAddress address={address} handleConfirmAddress={handleConfirmAddress} />
                  {addressError && (
                    <div className="text-red-500 text-sm bg-red-100 px-1">
                      Vui lòng điền thông tin giao hàng
                    </div>
                  )}
                </>
              )}
              <div>
                <Divider className="my-4" />
              </div>
              <div className="columns-2">
                <div>
                  <span className="font-semibold">Tổng tiền </span>
                  <span className="text-gray-400 text-xs">({checkedItems.length} sản phẩm)</span>
                </div>
                <div className="text-end">{formatVND.format(total.price())}</div>
              </div>
              <div className="columns-2">
                <div className="font-semibold">Đã giảm</div>
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
              <Radio.Group
                value={paymentMethodId ?? paymentMethods.at(0)?.id}
                onChange={onChangePaymentMethod}
                size="large"
              >
                <Space direction="vertical">
                  {paymentMethods.map((item, i) => {
                    let label = (
                      <div className="flex items-center gap-2">
                        <div>Cổng thanh toán {item.name}</div>
                        <Image
                          alt={item.name}
                          src={`images/${item.name}_Logo.png`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          unoptimized
                          className={`w-6 h-auto ${!item.isActive && 'filter grayscale'}`}
                        />
                        {item.isActive || '(Không khả dụng)'}
                      </div>
                    )

                    if (item.name.toUpperCase() === 'COD')
                      label = <div>Thanh toán khi nhận hàng</div>

                    return (
                      <Radio key={i} value={item.id} disabled={!item.isActive}>
                        {label}
                      </Radio>
                    )
                  })}
                </Space>
              </Radio.Group>
            </div>

            <Button
              size="large"
              type="primary"
              danger
              onClick={() =>
                modal.confirm({
                  title: 'Xác nhận đặt hàng',
                  content: (
                    <>
                      <div>Bạn chắc chắn đặt đơn hàng này?</div>
                      {checkedItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div key={i} className="truncate w-2/3 font-semibold">
                            {item.quantity} x {item.productName}
                          </div>
                          <div className="">
                            {item.colorName} - {item.sizeName}
                          </div>
                        </div>
                      ))}
                    </>
                  ),
                  icon: <InfoCircleFilled className="text-blue-500" />,
                  onOk: handleCreateOrder,
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                })
              }
              loading={isMutatingCreateOrder}
              disabled={
                checkedItems.length <= 0 || addressError || paymentMethods.every((e) => !e.isActive)
              }
              className="rounded-none w-full"
            >
              Đặt hàng
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
