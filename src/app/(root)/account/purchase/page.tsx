'use client'

import {
  Button,
  CountdownProps,
  Pagination,
  PaginationProps,
  Popconfirm,
  Statistic,
  Table,
  TableProps,
  Tag,
} from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useAuth from '~/hooks/useAuth'
import httpService from '~/lib/http-service'
import { ORDER_API } from '~/utils/api-urls'
import {
  Cancel_Status,
  formatDate,
  formatVND,
  getOrderStatus,
  getPaymentDeadline,
  Received_Status,
} from '~/utils/common'

const { Countdown } = Statistic

const columns = (
  handleCancelOrder: (id: number) => Promise<void>,
  payBack: (url: string | undefined) => void,
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
    render: (value) => {
      const colorMap = {
        [Cancel_Status]: '#FF4D4F',
        [Received_Status]: '#87d068',
        1: 'green',
        default: 'blue',
      }

      const status = getOrderStatus(value)
      const color = colorMap[value] || colorMap.default

      return value === 0 ? (
        status
      ) : (
        <Tag className="m-0" color={color}>
          {status}
        </Tag>
      )
    },
  },
  {
    title: 'Tổng cộng',
    dataIndex: 'total',
    render: (value) => formatVND.format(value),
  },
  {
    title: 'Thanh toán',
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
          <Tag className="m-0" color="red">
            Chưa thanh toán
          </Tag>
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
          <div className="space-x-2">
            <Button className="rounded-sm">Chi tiết</Button>
            {item.orderStatus === 0 && (
              <Popconfirm title="Xác nhận hủy đơn hàng" onConfirm={() => handleCancelOrder(value)}>
                <Button className="rounded-sm" danger>
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
  const router = useRouter()

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [params, setParams] = useState<PaginationType>({ page, pageSize })

  const { data, isLoading } = useSWR<PagedType<OrderType>>(
    [ORDER_API, session, params],
    ([ORDER_API, session, params]) => httpService.getWithSessionParams(ORDER_API, session, params),
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
    setParams({ page: p, pageSize: pSize })
  }

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={orders?.items ?? []}
        columns={columns(handleCancelOrder, payBack)}
        pagination={false}
        className="overflow-x-auto"
        rowKey={(item) => item.id}
      />
      {(data?.items && data.items.length <= 0) || (
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
    </>
  )
}
