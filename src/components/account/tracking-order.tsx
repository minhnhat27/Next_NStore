import { Divider, Modal, Skeleton } from 'antd'

import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { ORDER_API } from '~/utils/api-urls'
import { useEffect, useState } from 'react'
import { formatDateTime } from '~/utils/common'
import Map from './map'

interface IProp {
  shippingCode?: string
  openTrackOder: boolean
  closeTrackingOrder: () => void
}

export default function TrackingOrder({ shippingCode, openTrackOder, closeTrackingOrder }: IProp) {
  const { data } = useSWRImmutable(
    shippingCode && ORDER_API + `/${shippingCode}/tracking`,
    httpService.get,
  )
  const { data: tracking_logs, isLoading: tracking_logs_load } = useSWRImmutable(
    shippingCode &&
      `https://dev-online-gateway.ghn.vn/order-tracking/public-api/client/tracking-logs?order_code=${shippingCode}`,
    httpService.get,
  )

  const [fromLocation, setFromLocation] = useState<[number, number]>()
  const [toLocation, setToLocation] = useState<[number, number]>()
  useEffect(() => {
    if (data) {
      setFromLocation([data?.data?.from_location?.lat, data?.data?.from_location?.long])
      setToLocation([data?.data?.to_location?.lat, data?.data?.to_location?.long])
    }
  }, [data])

  return (
    <>
      <Modal
        title="Theo dõi đơn hàng"
        maskClosable={false}
        centered
        open={openTrackOder}
        onCancel={closeTrackingOrder}
        onOk={closeTrackingOrder}
        okText="Đóng"
        footer={(_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        <Map
          fromLocation={fromLocation}
          toLocation={toLocation}
          fromAddress={data?.data?.from_address}
          toAddress={data?.data?.to_address}
          toInfo={data?.data?.to_name + ' - ' + data?.data?.to_phone}
        />
        <Divider />
        {tracking_logs_load ? (
          <Skeleton paragraph={{ rows: 2 }} active />
        ) : (
          tracking_logs &&
          tracking_logs?.data?.tracking_logs?.map((item: any, i: number) => (
            <div key={i}>
              <div className="text-xs">{item?.location?.address}</div>
              <div>
                {item?.action_at && formatDateTime(item.action_at)}:{' '}
                <span className="font-semibold">{item?.status_name}</span>
              </div>
              <Divider className="my-2" />
            </div>
          ))
        )}
      </Modal>
    </>
  )
}
