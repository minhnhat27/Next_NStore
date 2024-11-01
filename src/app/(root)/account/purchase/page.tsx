'use client'

import {
  Button,
  Divider,
  Drawer,
  List,
  Popconfirm,
  Skeleton,
  Statistic,
  Tag,
  Image as AntdImage,
  App,
} from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'
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
  showError,
  toNextImageLink,
} from '~/utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import TrackingOrder from '~/components/account/tracking-order'
import dayjs from 'dayjs'
const { Countdown } = Statistic

const Processing_Status = OrderStatus['Đang xử lý']
const Cancel_Status = OrderStatus['Đã hủy']
const BeingDelivered_Status = OrderStatus['Đang giao hàng']
const Received_Status = OrderStatus['Đã nhận hàng']

export default function Purchase() {
  const { state } = useAuth()
  const session = state.userInfo?.session
  const { router } = useRealTimeParams()
  const { message } = App.useApp()

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
    try {
      await httpService.del(ORDER_API + `/${id}`)
      setOrders((pre) => pre.map((e) => (e.id === id ? { ...e, orderStatus: Cancel_Status } : e)))
    } catch (error) {
      message.error(showError(error))
    }
  }

  const payBack = (url: string | undefined) => url && router.push(url)

  const setId = (id: number) => setOrderId(id)

  const onOpenDetail = (id: number) => {
    setOrderId(id)
    setOpenDrawer(true)
  }

  const mutateReview = (orderId: number) => {
    if (data) {
      const newItems = data.items.map((item) =>
        item.id === orderId ? { ...item, reviewed: true } : item,
      )
      mutate({ ...data, items: newItems })
      setOrders(newItems)
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

  const confirmDelivery = async (id: number) => {
    try {
      await httpService.put(ORDER_API + `/${id}/confirm-delivery`)
      if (data) {
        const newItems = data.items.map((item) =>
          item.id === id
            ? {
                ...item,
                orderStatus: Received_Status,
                reviewDeadline: dayjs().add(15, 'day').toISOString(),
              }
            : item,
        )
        mutate({ ...data, items: newItems })
        setOrders(newItems)
      }
    } catch (error) {
      message.error(showError(error))
    }
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
            renderItem={(order, i) => (
              <List.Item
                className={`border-x border-t mb-4 shadow p-4 rounded-sm ${
                  i % 2 !== 0 && 'bg-gray-100'
                }`}
                key={order.id}
              >
                <List.Item.Meta
                  className="mb-0"
                  title={
                    <div className="text-xs md:text-sm flex flex-col gap-2">
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
                      {order.orderStatus !== Received_Status &&
                        order.orderStatus !== Cancel_Status && (
                          <div className="flex flex-col md:flex-row justify-between md:items-center">
                            {order.expected_delivery_time && (
                              <div>
                                <span>Ngày nhận hàng dự kiến: </span>
                                <span className="font-bold text-cyan-700">
                                  {formatDate(order.expected_delivery_time)}
                                </span>
                              </div>
                            )}
                            {order.shippingCode && (
                              <div className="text-end">
                                Mã vận đơn:{' '}
                                <span className="font-bold text-emerald-700">
                                  {order.shippingCode}{' '}
                                </span>
                                <Button
                                  onClick={() => onClickTrackOrder(order.shippingCode)}
                                  type="link"
                                  className="px-0"
                                >
                                  (Tra cứu)
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      {order.receivedDate && order.orderStatus === Received_Status && (
                        <div className="text-end">
                          Ngày nhận hàng:{' '}
                          <span className="text-red-500 font-bold">
                            {formatDate(order.receivedDate)}
                          </span>
                        </div>
                      )}
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
                  <Divider className="my-2" />
                  {order.productOrderDetail && (
                    <div className="flex gap-2">
                      <Image
                        height={0}
                        width={0}
                        sizes="20vw"
                        alt="sản phẩm"
                        src={toNextImageLink(order.productOrderDetail.imageUrl)}
                        className="h-20 w-14 object-contain"
                      />
                      <div>
                        <div className="line-clamp-3">{order.productOrderDetail.productName}</div>
                        <div>
                          {order.productOrderDetail.quantity} x{' '}
                          {formatVND.format(order.productOrderDetail.originPrice)}
                        </div>
                      </div>
                    </div>
                  )}
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
                    {order.orderStatus === Received_Status &&
                    !order.reviewed &&
                    order.receivedDate &&
                    dayjs(order.reviewDeadline).diff(dayjs(), 'date') >= 0 ? (
                      <>
                        {dayjs(order.reviewDeadline).diff(dayjs(), 'day') === 0 ? (
                          dayjs(order.reviewDeadline).diff(dayjs(), 'h') === 0 ? (
                            <span className="text-xs">
                              Còn {dayjs(order.reviewDeadline).diff(dayjs(), 'm')} phút để đánh giá{' '}
                            </span>
                          ) : (
                            <span className="text-xs">
                              Còn {dayjs(order.reviewDeadline).diff(dayjs(), 'h')} giờ để đánh giá{' '}
                            </span>
                          )
                        ) : (
                          <span className="text-xs">
                            Còn {dayjs(order.reviewDeadline).diff(dayjs(), 'day')} ngày để đánh giá{' '}
                          </span>
                        )}

                        <ReviewProduct
                          order_details_load={order_details_load}
                          order_details={order_details}
                          id={order.id}
                          getDetail={setId}
                          mutateReview={mutateReview}
                        />
                      </>
                    ) : (
                      order.reviewed && (
                        <>
                          <span className="text-xs pt-1 text-gray-500">Đã đánh giá </span>
                          <span className="text-yellow-400">&#9733;</span>
                        </>
                      )
                    )}
                    {order.orderStatus === BeingDelivered_Status && (
                      <Popconfirm
                        title="Xác nhận đã nhận hàng"
                        onConfirm={() => confirmDelivery(order.id)}
                      >
                        <Button className="m-1 rounded-sm" type="primary" danger>
                          Đã nhận hàng
                        </Button>
                      </Popconfirm>
                    )}
                    <Button className="m-1 rounded-sm" onClick={() => onOpenDetail(order.id)}>
                      Xem chi tiết
                    </Button>
                    {order.orderStatus === Processing_Status && (
                      <Popconfirm
                        title="Xác nhận hủy đơn hàng"
                        onConfirm={() => handleCancelOrder(order.id)}
                      >
                        <Button className="m-1 rounded-sm" type="primary" danger>
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
        styles={{ body: { padding: '1rem 1.5rem' } }}
        loading={order_details_load}
        onClose={() => setOpenDrawer(false)} // setOrderId(undefined)
        title={`Chi tiết đơn hàng #${orderId}`}
        footer={
          order_details && (
            <>
              {/* <div className="py-1">Ngày đặt hàng: {formatDateTime(order_details.orderDate)}</div> */}
              <div>Phí vận chuyển: {formatVND.format(order_details.shippingCost)}</div>
              <div>Giảm giá: {formatVND.format(order_details.voucherDiscount)}</div>
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
            <Divider className="my-2" />

            <List
              itemLayout="vertical"
              size="large"
              dataSource={order_details.productOrderDetails}
              renderItem={(item) => (
                <List.Item className="p-0 my-2" key={item.productId}>
                  <List.Item.Meta
                    className="mb-0"
                    avatar={
                      <AntdImage
                        alt={item.productName}
                        className="h-28 w-20 object-cover"
                        src={toNextImageLink(item.imageUrl)}
                      />
                    }
                    title={<div className="line-clamp-2">{item.productName}</div>}
                    description={
                      <>
                        <div>
                          {item.quantity} x {formatVND.format(item.originPrice)}
                        </div>
                        <div className="text-gray-500 font-semibold">Phân loại: {item.variant}</div>
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
