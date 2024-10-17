'use client'

import {
  Button,
  Divider,
  Drawer,
  List,
  Pagination,
  PaginationProps,
  Popconfirm,
  Statistic,
  Tag,
} from 'antd'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
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
  toNextImageLink,
} from '~/utils/common'

const { Countdown } = Statistic

const Processing_Status = OrderStatus['Đang xử lý']
const Confirmed_Status = OrderStatus['Đã xác nhận']
const Cancel_Status = OrderStatus['Đã hủy']
const Received_Status = OrderStatus['Đã nhận hàng']

// const AwaitingPickup_Status = OrderStatus['Chờ lấy hàng']
// const Shipping_Status = OrderStatus['Đang vận chuyển']
// const BeingDelivered_Status = OrderStatus['Đang giao hàng']

// const columns = (
//   handleCancelOrder: (id: number) => Promise<void>,
//   payBack: (url: string | undefined) => void,
//   onOpenDetail: (id: number) => void,
//   setId: (id: number) => void,
//   mutateReview: (id: number) => void,
//   order_details_load: boolean,
//   order_details?: OrderDetailsType,
// ): TableProps<OrderType>['columns'] => [
//   {
//     title: 'Mã đơn',
//     dataIndex: 'id',
//     render: (value) => `#${value}`,
//   },
//   {
//     title: 'Ngày đặt',
//     dataIndex: 'orderDate',
//     render: (value) => formatDate(value),
//   },
//   {
//     title: 'Trạng thái',
//     dataIndex: 'orderStatus',
//     render: (value, item) => {
//       const colorMap = {
//         1: 'green',
//         [Cancel_Status.valueOf()]: '#FF4D4F',
//         [Received_Status.valueOf()]: '#16a34a',
//         default: 'blue',
//       }

//       const status = getOrderStatus(value)
//       const color = colorMap[value] || colorMap.default

//       return value === 0 ? (
//         status
//       ) : (
//         <>
//           <div>
//             <Tag className="m-0" color={OrderStatusTagColor[item.orderStatus]}>
//               {status}
//             </Tag>
//           </div>
//           {item.orderStatus === Received_Status && !item.reviewed ? (
//             <ReviewProduct
//               order_details_load={order_details_load}
//               order_details={order_details}
//               id={item.id}
//               getDetail={setId}
//               mutateReview={mutateReview}
//             />
//           ) : (
//             item.reviewed && (
//               <>
//                 <span className="text-xs pt-1 text-gray-500">Đã đánh giá </span>
//                 <span className="text-yellow-400">&#9733;</span>
//               </>
//             )
//           )}
//         </>
//       )
//     },
//   },
//   {
//     title: 'Tổng cộng',
//     dataIndex: 'total',
//     render: (value) => formatVND.format(value),
//   },
//   {
//     title: 'Phương thức T.T',
//     dataIndex: 'paymentMethod',
//     align: 'center',
//     render: (value, item) => (
//       <>
//         <div>{value}</div>
//         {item.amountPaid >= item.total ? (
//           <Tag className="m-0" color="gold">
//             Đã thanh toán
//           </Tag>
//         ) : (
//           item.orderStatus !== Cancel_Status &&
//           item.payBackUrl && (
//             <Tag className="m-0" color="red">
//               Chờ thanh toán
//             </Tag>
//           )
//         )}
//       </>
//     ),
//   },
//   {
//     title: 'Hành động',
//     dataIndex: 'id',
//     render: (value, item) => {
//       const deadline = getPaymentDeadline(item.orderDate)

//       return (
//         <div className="space-y-2">
//           <div className="flex gap-2">
//             <Button onClick={() => onOpenDetail(value)} className="rounded-sm">
//               Chi tiết
//             </Button>
//             {item.orderStatus === 0 && (
//               <Popconfirm title="Xác nhận hủy đơn hàng" onConfirm={() => handleCancelOrder(value)}>
//                 <Button type="primary" className="rounded-sm" danger>
//                   Hủy đơn
//                 </Button>
//               </Popconfirm>
//             )}
//           </div>

//           {item.amountPaid < item.total &&
//             item.paymentMethod !== 'COD' &&
//             item.orderStatus !== Cancel_Status &&
//             item.payBackUrl && (
//               <>
//                 <div className="flex gap-2">
//                   <div>Đơn hàng sẽ bị hủy sau</div>
//                   <Countdown
//                     value={deadline}
//                     format="mm:ss"
//                     valueStyle={{ fontSize: '1rem' }}
//                     onFinish={() => handleCancelOrder(value)}
//                   />
//                 </div>
//                 <Button
//                   onClick={() => payBack(item.payBackUrl)}
//                   className="rounded-sm"
//                   type="primary"
//                   danger
//                 >
//                   Thanh toán lại
//                 </Button>
//               </>
//             )}
//         </div>
//       )
//     },
//   },
// ]

export default function Purchase() {
  const { state } = useAuth()
  const session = state.userInfo?.session
  const searchParams = useSearchParams()
  const { router, setRealTimeParams } = useRealTimeParams()

  const [orderId, setOrderId] = useState<number>()

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  const [page, setPage] = useState<number>(() => {
    const p = searchParams.get('page')
    return p ? parseInt(p) : 1
  })

  const [pageSize, setPageSize] = useState<number>(() => {
    const p = searchParams.get('pageSize')
    return p ? parseInt(p) : 10
  })

  const [params, setParams] = useState<PaginationType>({ page, pageSize })

  const { data, isLoading, mutate } = useSWR<PagedType<OrderType>>(
    [ORDER_API, session, params],
    ([ORDER_API, session, params]) => httpService.getWithSessionParams(ORDER_API, session, params),
  )

  const { data: order_details, isLoading: order_details_load } = useSWRImmutable<OrderDetailsType>(
    orderId ? [ORDER_API, session, orderId] : undefined,
    ([ORDER_API, session]) => httpService.getWithSession(ORDER_API + `/${orderId}`, session),
  )

  const [orders, setOrders] = useState<PagedType<OrderType>>()

  useEffect(() => {
    if (data) setOrders(data)
  }, [data])

  const handleCancelOrder = async (id: number): Promise<void> => {
    await httpService.del(ORDER_API + `/${id}`)
    if (orders) {
      const items = orders.items.map((e) => {
        if (e.id === id) return { ...e, orderStatus: Cancel_Status }
        return e
      })
      setOrders({ ...orders, items: items })
    }
  }

  const payBack = (url: string | undefined) => url && router.push(url)

  const onChangeCurrentPage: PaginationProps['onChange'] = (p, pSize) => {
    setPage(p)
    setPageSize(pSize)

    const pr = { page: p, pageSize: pSize }
    setParams(pr)
    setRealTimeParams(pr)
  }

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

  return (
    <>
      <List
        loading={isLoading}
        itemLayout="vertical"
        dataSource={orders?.items}
        renderItem={(order) => (
          <List.Item
            className="border-x border-b drop-shadow-sm mb-4 px-4 bg-white rounded-sm"
            key={order.id}
          >
            <List.Item.Meta
              title={
                <>
                  <div className="flex justify-between items-center gap-2">
                    <div className="text-xs md:text-sm inline">
                      <div>
                        <span className="text-2xl font-semibold">#{order.id}</span>
                        <span> ngày đặt hàng {formatDateTime(order.orderDate)}</span>
                      </div>
                      {order.shippingCode && (
                        <div>
                          Mã vận đơn: <span className="font-semibold">{order.shippingCode}</span>{' '}
                          (Giao hàng nhanh)
                        </div>
                      )}
                      {!(order.orderStatus == Received_Status) && order.expected_delivery_time && (
                        <div>
                          Ngày nhận hàng dự kiến:
                          <span className="font-semibold">
                            {' '}
                            {formatDate(order.expected_delivery_time)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Tag color={OrderStatusTag[order.orderStatus]} className="text-sm py-[0.15rem]">
                      {OrderStatus[order.orderStatus]}
                    </Tag>
                  </div>
                </>
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

      {/* <Table
        loading={isLoading}
        dataSource={orders?.items ?? []}
        columns={columns(
          handleCancelOrder,
          payBack,
          onOpenDetail,
          setId,
          mutateReview,
          order_details_load,
          order_details,
        )}
        pagination={false}
        className="overflow-x-auto"
        rowKey={(item) => item.id}
      /> */}

      <Pagination
        align="center"
        className="py-4"
        current={page}
        pageSize={pageSize}
        showSizeChanger
        onChange={onChangeCurrentPage}
        total={data?.totalItems}
      />
      <Drawer
        open={openDrawer}
        closable
        destroyOnClose
        loading={order_details_load}
        onClose={() => {
          setOrderId(undefined)
          setOpenDrawer(false)
        }}
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
                <List.Item className="p-0" key={item.productName}>
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
