'use client'

import { Button, Divider, Drawer, List, Popconfirm, Skeleton, Statistic, Tag } from 'antd'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import ReviewProduct from '~/components/account/review-product'
import useAuth from '~/hooks/useAuth'
import { useRealTimeParams } from '~/hooks/useRealTimeParams'
import httpService from '~/lib/http-service'
import { OrderStatus, OrderStatusTag } from '~/types/enum'
import { ORDER_API } from '~/utils/api-urls'
import {
  formatDate,
  formatDateTime,
  formatVND,
  getPaymentDeadline,
  toNextImageLink,
} from '~/utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import TrackingOrder from '~/components/account/tracking-order'
const { Countdown } = Statistic

const Processing_Status = OrderStatus['Đang xử lý']
const Cancel_Status = OrderStatus['Đã hủy']
const Received_Status = OrderStatus['Đã nhận hàng']

export default function Purchase() {
  const { state } = useAuth()
  const session = state.userInfo?.session
  const { router } = useRealTimeParams()

  const [orderId, setOrderId] = useState<number>()

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openTrackOder, setOpenTrackOder] = useState<boolean>(false)
  const [shippingCode, setShippingCode] = useState<string>()

  const [params, setParams] = useState<PaginationType>({ page: 1, pageSize: 5 })
  const [total, setTotal] = useState<number>(5)

  const { data, mutate } = useSWR<PagedType<OrderType>>(
    [ORDER_API, session, params],
    ([ORDER_API, session, params]) => httpService.getWithSessionParams(ORDER_API, session, params),
  )

  const { data: order_details, isLoading: order_details_load } = useSWRImmutable<OrderDetailsType>(
    orderId ? [ORDER_API, session, orderId] : undefined,
    ([ORDER_API, session]) => httpService.getWithSession(ORDER_API + `/${orderId}`, session),
  )

  const [orders, setOrders] = useState<OrderType[]>([])

  useEffect(() => {
    if (data) {
      setOrders((pre) => [...pre, ...data.items])
      setTotal(data.totalItems)
    }
  }, [data])

  const handleCancelOrder = async (id: number): Promise<void> => {
    await httpService.del(ORDER_API + `/${id}`)
    setOrders((pre) => pre.map((e) => (e.id === id ? { ...e, orderStatus: Cancel_Status } : e)))
  }

  const payBack = (url: string | undefined) => url && router.push(url)

  const setId = (id: number) => setOrderId(id)

  const onOpenDetail = (id: number) => {
    setOrderId(id)
    setOpenDrawer(true)
  }

  const mutateReview = (orderId: number) => {
    if (data) {
      const newItems = data.items.map((item) => {
        if (item.id === orderId) item.reviewed = true
        return item
      })
      mutate({ ...data, items: newItems })
    }
  }

  const loadMoreData = () => setParams((pre) => ({ ...pre, page: pre.page + 1 }))

  const onClickTrackOrder = (shippingCode?: string) => {
    if (shippingCode) {
      setShippingCode(shippingCode)
      setOpenTrackOder(true)
    }
  }

  const closeTrackingOrder = () => {
    setOpenTrackOder(false)
    setShippingCode(undefined)
  }

  return (
    <>
      <div id="scrollableDiv" className="overflow-auto max-h-[calc(100vh-10rem)]">
        <InfiniteScroll
          dataLength={orders.length}
          next={loadMoreData}
          hasMore={orders.length < total}
          loader={<Skeleton paragraph={{ rows: 5 }} active />}
          endMessage={<Divider plain>Không còn đơn hàng 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout="vertical"
            dataSource={orders}
            renderItem={(order) => (
              <List.Item
                className="border-x border-b drop-shadow-sm mb-2 p-4 bg-white rounded-sm"
                key={order.id}
              >
                <List.Item.Meta
                  title={
                    <div className="text-xs md:text-sm flex flex-col gap-4">
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <span className="text-2xl font-semibold">#{order.id}</span>
                          <span> ngày đặt hàng {formatDateTime(order.orderDate)}</span>
                        </div>
                        <Tag
                          color={OrderStatusTag[order.orderStatus]}
                          className="mx-0 py-[0.15rem]"
                        >
                          {OrderStatus[order.orderStatus]}
                        </Tag>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between md:items-center">
                        {order.orderStatus !== Received_Status && order.expected_delivery_time && (
                          <div>
                            <span>Ngày nhận hàng dự kiến: </span>
                            <span className="font-bold text-cyan-700">
                              {formatDate(order.expected_delivery_time)}
                            </span>
                          </div>
                        )}
                        {order.orderStatus !== Cancel_Status && order.shippingCode && (
                          <div className="text-end">
                            <div>
                              {' '}
                              Mã vận đơn:{' '}
                              <span className="font-bold text-emerald-600">
                                {order.shippingCode}
                              </span>{' '}
                              (GHN)
                            </div>
                            <Button
                              onClick={() => onClickTrackOrder(order.shippingCode)}
                              type="link"
                              className="px-0"
                            >
                              Tra cứu
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                />
                <div className="text-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Phương thức thanh toán</div>
                    <div>{order.paymentMethodName}</div>
                  </div>
                  <Divider className="my-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <div>Tổng cộng</div>
                    <div>{formatVND.format(order.total)}</div>
                  </div>
                  <Divider className="my-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <div>Đã thanh toán</div>
                    <div>{formatVND.format(order.amountPaid)}</div>
                  </div>
                  <div className="mt-2 text-end gap-2">
                    {order.amountPaid < order.total &&
                      order.orderStatus !== Cancel_Status &&
                      order.payBackUrl && (
                        <div className="flex items-center gap-2">
                          <div>Đơn hàng sẽ bị hủy sau</div>
                          <Countdown
                            value={getPaymentDeadline(order.orderDate)}
                            format="mm:ss"
                            valueStyle={{ fontSize: '1rem' }}
                            onFinish={() => handleCancelOrder(order.id)}
                          />
                          <Button
                            onClick={() => payBack(order.payBackUrl)}
                            className="rounded-sm m-1"
                            type="primary"
                            danger
                          >
                            Thanh toán lại
                          </Button>
                        </div>
                      )}
                    {order.orderStatus === Received_Status && !order.reviewed ? (
                      <ReviewProduct
                        order_details_load={order_details_load}
                        order_details={order_details}
                        id={order.id}
                        getDetail={setId}
                        mutateReview={mutateReview}
                      />
                    ) : (
                      order.reviewed && (
                        <>
                          <span className="text-xs pt-1 text-gray-500">Đã đánh giá </span>
                          <span className="text-yellow-400">&#9733;</span>
                        </>
                      )
                    )}
                    <Button className="m-1" onClick={() => onOpenDetail(order.id)}>
                      Chi tiết
                    </Button>
                    {order.orderStatus === Processing_Status && (
                      <Popconfirm
                        title="Xác nhận hủy đơn hàng"
                        onConfirm={() => handleCancelOrder(order.id)}
                      >
                        <Button className="m-1" type="primary" danger>
                          Hủy đơn
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>

      <TrackingOrder
        shippingCode={shippingCode}
        closeTrackingOrder={closeTrackingOrder}
        openTrackOder={openTrackOder}
      />

      <Drawer
        open={openDrawer}
        closable
        destroyOnClose
        loading={order_details_load}
        onClose={() => setOpenDrawer(false)} // setOrderId(undefined)
        title={`Chi tiết đơn hàng #${orderId}`}
        footer={
          order_details && (
            <>
              <div className="py-1">Ngày đặt hàng: {formatDateTime(order_details.orderDate)}</div>
              <div>Phí vận chuyển: {formatVND.format(order_details.shippingCost)}</div>
              <div>
                Tổng cộng:{' '}
                <span className="text-lg font-semibold">
                  {formatVND.format(order_details.total)}
                </span>
              </div>
            </>
          )
        }
      >
        {order_details && (
          <>
            <div className="flex items-center gap-1">
              <FaLocationDot className="text-xl text-red-600" />
              <div className="font-bold inline-block truncate">{order_details.receiver}</div>
            </div>
            <div>{order_details.deliveryAddress}</div>
            <Divider />

            <List
              itemLayout="vertical"
              size="large"
              dataSource={order_details.productOrderDetails}
              renderItem={(item) => (
                <List.Item className="p-0" key={item.productId}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        alt={item.productName}
                        className="h-20 w-20"
                        src={toNextImageLink(item.imageUrl)}
                      />
                    }
                    title={<div className="truncate">{item.productName}</div>}
                    description={
                      <>
                        <div>
                          {item.quantity} x {formatVND.format(item.price)}
                        </div>
                        <div className="text-gray-500 font-semibold">
                          Phân loại: {item.colorName} - {item.sizeName}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </>
  )
}
