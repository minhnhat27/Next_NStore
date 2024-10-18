import { Divider, Modal, Skeleton } from 'antd'

import useSWRImmutable from 'swr/immutable'
import httpService from '~/lib/http-service'
import { ORDER_API } from '~/utils/api-urls'
import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import { formatDateTime } from '~/utils/common'
import useLeaflet from '../../hooks/useLeaflet'
import { Routing } from 'leaflet'

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

  if (tracking_logs) console.log(tracking_logs)

  const [fromLocation, setFromLocation] = useState<[number, number]>()
  const [toLocation, setToLocation] = useState<[number, number]>()

  const { L, MapContainer, Marker, Popup, TileLayer } = useLeaflet()

  useEffect(() => {
    if (data) {
      setFromLocation([data?.data?.from_location?.lat, data?.data?.from_location?.long])
      setToLocation([data?.data?.to_location?.lat, data?.data?.to_location?.long])
    }
  }, [data])

  const defaultLocation: [number, number] = [10.030767, 105.768338]

  const fromAddress = data?.data?.from_address
  const toAddress = data?.data?.to_address

  //   const routingControlRef = useRef<any>(null)
  const ZoomToLocation = () => {
    const map = useMap()

    useEffect(() => {
      try {
        if (L && fromLocation && toLocation) {
          // routingControl?.remove()
          //   if (routingControlRef.current) {
          //     map.removeControl(routingControlRef.current)
          //     routingControlRef.current = null // Đặt lại ref sau khi xóa
          //   }

          L.Routing.control({
            waypoints: [L.latLng(fromLocation), L.latLng(toLocation)],
            routeWhileDragging: false,
            show: false,
            createMarker: () => null,
            addWaypoints: false,
          }).addTo(map)

          //   routingControlRef.current = control

          const bounds = L.latLngBounds([L.latLng(fromLocation), L.latLng(toLocation)])
          map.fitBounds(bounds)
        }
      } catch (error) {
        console.log(error)
      }

      //   return () => {
      //     if (routingControlRef.current) {
      //       map.removeControl(routingControlRef.current)
      //       routingControlRef.current = null // Đặt lại ref
      //     }
      //   }
    }, [L, map, fromLocation, toLocation])

    return null
  }

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
        <MapContainer
          className="h-48 overflow-auto"
          center={defaultLocation}
          zoom={8}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
          <ZoomToLocation />
          {fromLocation && (
            <>
              <Marker
                position={fromLocation}
                icon={
                  L &&
                  new L.Icon({
                    iconUrl: '/images/truck.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                  })
                }
              >
                <Popup>{fromAddress}</Popup>
              </Marker>
              {toLocation && (
                <Marker
                  position={toLocation}
                  icon={
                    L &&
                    new L.Icon({
                      iconUrl: '/images/receiver.png',
                      iconSize: [32, 32],
                      iconAnchor: [16, 32],
                      popupAnchor: [0, -32],
                    })
                  }
                >
                  <Popup>
                    <div>
                      {data?.data?.to_name} {data?.data?.to_phone}
                    </div>
                    <div>{toAddress}</div>
                  </Popup>
                </Marker>
              )}
              {/* <Polyline positions={polylinePoints} color="blue" /> */}
            </>
          )}
        </MapContainer>
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
