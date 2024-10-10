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
  Table,
  TableProps,
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
import { OrderStatus } from '~/types/enum'
import { ORDER_API } from '~/utils/api-urls'
import {
  formatDate,
  formatDateTime,
  formatVND,
  getOrderStatus,
  getPaymentDeadline,
  toNextImageLink,
} from '~/utils/common'

const { Countdown } = Statistic

const Cancel_Status = OrderStatus['Đã hủy'].valueOf()
const Received_Status = OrderStatus['Đã nhận hàng'].valueOf()

const columns = (
  handleCancelOrder: (id: number) => Promise<void>,
  payBack: (url: string | undefined) => void,
  onOpenDetail: (id: number) => void,
  setId: (id: number) => void,
  order_details_load: boolean,
  order_details?: OrderDetailsType,
): TableProps<OrderType>['columns'] => [
  {
    title: 'Mã đơn',
    dataIndex: 'id',
    render: (value) => `#${value}`,
  },
  {
    title: 'Ngày đặt',
    dataIndex: 'orderDate',
    render: (value) => formatDate(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'orderStatus',
    render: (value, item) => {
      const colorMap = {
        1: 'green',
        [Cancel_Status]: '#FF4D4F',
        [Received_Status]: '#16a34a',
        default: 'blue',
      }

      const status = getOrderStatus(value)
      const color = colorMap[value] || colorMap.default

      return value === 0 ? (
        status
      ) : (
        <>
          <div>
            <Tag className="m-0" color={color}>
              {status}
            </Tag>
          </div>
          {item.orderStatus === Received_Status && (
            <ReviewProduct
              order_details_load={order_details_load}
              order_details={order_details}
              id={item.id}
              getDetail={setId}
            />
          )}
        </>
      )
    },
  },
  {
    title: 'Tổng cộng',
    dataIndex: 'total',
    render: (value) => formatVND.format(value),
  },
  {
    title: 'Phương thức T.T',
    dataIndex: 'paymentMethod',
    align: 'center',
    render: (value, item) => (
      <>
        <div>{value}</div>
        {item.amountPaid >= item.total ? (
          <Tag className="m-0" color="gold">
            Đã thanh toán
          </Tag>
        ) : (
          item.orderStatus !== Cancel_Status &&
          item.payBackUrl && (
            <Tag className="m-0" color="red">
              Chờ thanh toán
            </Tag>
          )
        )}
      </>
    ),
  },
  {
    title: 'Hành động',
    dataIndex: 'id',
    render: (value, item) => {
      const deadline = getPaymentDeadline(item.orderDate)

      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={() => onOpenDetail(value)} className="rounded-sm">
              Chi tiết
            </Button>
            {item.orderStatus === 0 && (
              <Popconfirm title="Xác nhận hủy đơn hàng" onConfirm={() => handleCancelOrder(value)}>
                <Button type="primary" className="rounded-sm" danger>
                  Hủy đơn
                </Button>
              </Popconfirm>
            )}
          </div>

          {item.amountPaid < item.total &&
            item.paymentMethod !== 'COD' &&
            item.orderStatus !== Cancel_Status &&
            item.payBackUrl && (
              <>
                <div className="flex gap-2">
                  <div>Đơn hàng sẽ bị hủy sau</div>
                  <Countdown
                    value={deadline}
                    format="mm:ss"
                    valueStyle={{ fontSize: '1rem' }}
                    onFinish={() => handleCancelOrder(value)}
                  />
                </div>
                <Button
                  onClick={() => payBack(item.payBackUrl)}
                  className="rounded-sm"
                  type="primary"
                  danger
                >
                  Thanh toán lại
                </Button>
              </>
            )}
        </div>
      )
    },
  },
]

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

  const { data, isLoading } = useSWR<PagedType<OrderType>>(
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

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={orders?.items ?? []}
        columns={columns(
          handleCancelOrder,
          payBack,
          onOpenDetail,
          setId,
          order_details_load,
          order_details,
        )}
        pagination={false}
        className="overflow-x-auto"
        rowKey={(item) => item.id}
      />
      {data && data.items.length > 0 && (
        <Pagination
          align="center"
          className="py-4"
          current={page}
          pageSize={pageSize}
          showSizeChanger
          onChange={onChangeCurrentPage}
          total={data?.totalItems}
        />
      )}
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
              <div className="flex justify-between">
                <div>
                  Tổng cộng:{' '}
                  <span className="text-lg font-semibold">
                    {formatVND.format(order_details.total)}
                  </span>
                </div>
                <Button type="primary" danger>
                  Đánh giá
                </Button>
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
