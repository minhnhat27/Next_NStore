'use client'

import { Button, Popconfirm, Table, TableProps, Tag } from 'antd'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useAuth } from '~/components/common/auth-provider'
import httpService from '~/lib/http-service'
import { ORDER_API } from '~/utils/api-urls'
import {
  Cancel_Status,
  formatDate,
  formatVND,
  getOrderStatus,
  Received_Status,
} from '~/utils/common'

const columns = (
  handleCancelOrder: (id: number) => Promise<void>,
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
    render: (value, item) => (
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
          item.orderStatus !== Cancel_Status && (
            <>
              <div>Đơn hàng sẽ bị hủy sau 30p</div>
              <Button className="rounded-sm" type="primary" danger>
                Thanh toán lại
              </Button>
            </>
          )}
      </div>
    ),
  },
]

export default function Purchase() {
  const { state } = useAuth()
  const session = state.userInfo?.session

  const { data, isLoading } = useSWR<PagedType<OrderType>>(
    [ORDER_API, session],
    ([ORDER_API, session]) => httpService.getWithSession(ORDER_API, session),
  )

  const [orders, setOrders] = useState<PagedType<OrderType>>()

  useEffect(() => {
    if (data) setOrders(data)

    console.log(data)
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

  return (
    <Table
      loading={isLoading}
      dataSource={orders?.items ?? []}
      columns={columns(handleCancelOrder)}
      pagination={false}
      className="overflow-x-auto"
      rowKey={(item) => item.id}
    />
  )
}
