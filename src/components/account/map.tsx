import { memo, useCallback, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import useLeaflet from '~/hooks/useLeaflet'

interface IProps {
  fromLocation?: [number, number]
  fromAddress?: string
  toLocation?: [number, number]
  toAddress?: string
  toInfo?: string
}
const Map = ({ fromLocation, toLocation, fromAddress, toAddress, toInfo }: IProps) => {
  const { L, MapContainer, Marker, Popup, TileLayer } = useLeaflet()
  const defaultLocation: [number, number] = [10.030767, 105.768338]

  const control = useRef<L.Control | null>(null)

  const ZoomToLocation = ({
    fLocation,
    tLocation,
    Leaflet,
  }: {
    fLocation: [number, number]
    tLocation: [number, number]
    Leaflet: any
  }) => {
    const map = useMap()

    useEffect(() => {
      try {
        if (map) {
          if (control.current) map.removeControl(control.current)

          const ct = Leaflet.Routing.control({
            waypoints: [Leaflet.latLng(fLocation), Leaflet.latLng(tLocation)],
            routeWhileDragging: false,
            show: false,
            createMarker: () => null,
            addWaypoints: false,
          }).addTo(map)

          const bounds = Leaflet.latLngBounds([
            Leaflet.latLng(fLocation),
            Leaflet.latLng(tLocation),
          ])
          map.fitBounds(bounds)

          control.current = ct
        }
      } catch (error) {
        console.log(error)
      }

      return () => {
        if (control.current) {
          map.removeControl(control.current)
        }
      }
    }, [Leaflet, map, fLocation, tLocation])

    return null
  }

  return (
    <>
      <MapContainer
        className="h-48 overflow-auto"
        center={defaultLocation}
        zoom={8}
        scrollWheelZoom={false}
      >
        {fromLocation && toLocation && L && (
          <ZoomToLocation Leaflet={L} fLocation={fromLocation} tLocation={toLocation} />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
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
                  <div>{toInfo}</div>
                  <div>{toAddress}</div>
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </>
  )
}

export default memo(Map)
