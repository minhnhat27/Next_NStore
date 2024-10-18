import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
})
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
})
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false,
})
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
})

export default function useLeaflet() {
  const [L, setL] = useState<any>()

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (typeof window !== 'undefined') {
          const leaflet = (await import('leaflet')).default
          await import('leaflet-routing-machine')
          setL(leaflet)
        }
      } catch (error) {
        console.error('Error loading leaflet:', error)
      }
    }

    loadLeaflet()
  }, [])
  return { L, MapContainer, TileLayer, Marker, Popup }
}
