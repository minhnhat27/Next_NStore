'use client'

import { DeleteFilled, DropboxOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Flex,
  InputNumber,
  List,
  Result,
  Skeleton,
  Steps,
  Tooltip,
  Typography,
} from 'antd'
import { useState } from 'react'
import { formatVND, toNextImageLink } from '~/utils/common'
import ReceiverInfo from './receiver-info'
import Link from 'next/link'
import Image from 'next/image'
import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { CART_API } from '~/utils/api-urls'
import { useAuth } from '../auth-provider'

const { Title } = Typography

export default function CartDetails() {
  const { state } = useAuth()
  const session = state.userInfo?.session
  const [checkedItems, setCheckedItems] = useState<CartItemsType[]>([])

  const { data: cartItems, isLoading } = useSWRImmutable<CartItemsType[]>(
    [CART_API, session],
    ([url, session]) => httpService.getWithSession(url, session),
  )

  const onChangeQuantity = (id: string, value: number | null) => {
    console.log('changed', `id: ${id}, value: ${value}`)
  }

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedItems(e.target.checked ? cartItems ?? [] : [])
  }

  const onCheckCartItems = (item: CartItemsType) => {
    const exist = checkedItems.find((e) => e.productId === item.productId)
    const newList = exist
      ? checkedItems.filter((e) => e.productId !== item.productId)
      : [...checkedItems, item]
    setCheckedItems(newList)
  }

  const handleDeleteCartItem = (productId: string) => {
    //setCartItems(cartItems.filter((e) => e.productId !== productId))
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />

  return (
    <>
      {cartItems && cartItems?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Title level={3}>
              <span className="uppercase text-sky-600">Chi tiết giỏ hàng -</span>
              <span className="col-span-3 text-red-600 text-xl font-semibold"> 1.350.000đ</span>
            </Title>
            <div className="border pl-4 py-4">
              <Checkbox
                key="checkall"
                checked={cartItems.length === checkedItems.length}
                indeterminate={checkedItems.length > 0 && checkedItems.length < cartItems.length}
                onChange={onCheckAllChange}
                className="select-none"
              >
                Chọn tất cả
              </Checkbox>
              <List
                dataSource={cartItems}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    styles={{ actions: { margin: 8 } }}
                    actions={[
                      <Tooltip title="Xóa sản phẩm" key="delete">
                        <Button
                          type="text"
                          className="text-red-500 hover:text-red-400"
                          //onClick={() => handleDeleteCartItem(item.productId)}
                          key="delete"
                        >
                          <DeleteFilled className="text-lg" />
                        </Button>
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Flex gap={10}>
                          <Checkbox
                            onChange={() => onCheckCartItems(item)}
                            checked={checkedItems.includes(item)}
                          />
                          <Image
                            alt="product"
                            className="transition-all w-28"
                            width={720}
                            height={100}
                            src={toNextImageLink(item.imageUrl)}
                          />
                        </Flex>
                      }
                      title={item.productName}
                      description={
                        <>
                          <InputNumber
                            className="w-16"
                            min={1}
                            defaultValue={item.quantity}
                            onChange={(e) => onChangeQuantity(item.productName, e)}
                          />
                          <span>
                            <span> x </span>
                            <span className="text-base text-black font-semibold">
                              {formatVND.format(
                                item.price - item.price * ((item.discountPercent ?? 0) / 100.0),
                              )}
                            </span>
                          </span>
                          {!item.discountPercent ||
                            (item.discountPercent > 0 && (
                              <>
                                <span className="line-through">{formatVND.format(item.price)}</span>
                                <span className="text-red-500"> ({item.discountPercent}%)</span>
                              </>
                            ))}
                          <Divider className="my-4" />
                          <div className="text-red-600 text-xl font-semibold">
                            {formatVND.format(
                              (item.price - item.price * ((item.discountPercent ?? 0) / 100.0)) *
                                item.quantity,
                            )}
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
            <div className="border p-4">
              <div className="grid grid-cols-2 gap-2">
                <Steps
                  className="pb-4"
                  size="small"
                  direction="vertical"
                  current={2}
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
                      description: 'Trên 400.000đ',
                    },
                  ]}
                />
                <div className="grid grid-cols-2 gap-2 h-fit">
                  <Title level={5}>Phí vận chuyển: </Title>
                  <div className="text-red-500">Miễn phí</div>

                  <Title level={5}>Giảm giá: </Title>
                  <div>350.000đ</div>

                  <Title level={5}>Mã giảm giá: </Title>
                  <div>250.000đ</div>
                </div>
              </div>

              <Divider />
              <div className="grid grid-cols-2 gap-2">
                <Title level={5}>Tổng cộng : </Title>
                <div className="text-red-600 text-2xl font-semibold">1.350.000đ</div>
              </div>
            </div>
          </div>
          <ReceiverInfo />
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
