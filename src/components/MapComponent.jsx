"use client"
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed } from 'lucide-react'

// Fix for default marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const markerRef = useRef(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        setPosition(marker.getLatLng())
      }
    },
  }

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  )
}

function LocateControl({ setPosition }) {
  const map = useMap()
  const [locating, setLocating] = useState(false)

  const handleLocate = () => {
    setLocating(true)
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, 15)
      setLocating(false)
    }).on("locationerror", function (e) {
      alert("Could not access your location. Please check browser permissions.")
      setLocating(false)
    })
  }

  return (
    <div className="leaflet-top leaflet-right" style={{ pointerEvents: 'auto', zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar" style={{ marginTop: '10px', marginRight: '10px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <button 
          onClick={(e) => { e.preventDefault(); handleLocate(); }}
          title="Use current location"
          className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 rounded-md transition-colors"
          style={{ color: locating ? '#E8A359' : '#14452F' }}
        >
          <LocateFixed className={locating ? "animate-pulse" : ""} size={20} />
        </button>
      </div>
    </div>
  )
}

export default function MapComponent({ initialPosition, onLocationSelect }) {
  const [position, setPosition] = useState(initialPosition)

  useEffect(() => {
    if (position) {
      // Ensure we always pass latitude and longitude correctly, 
      // leaflet returns latlng as object or array depending on events
      const lat = position.lat !== undefined ? position.lat : position[0]
      const lng = position.lng !== undefined ? position.lng : position[1]
      onLocationSelect(lat, lng)
    }
  }, [position]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MapContainer 
      center={initialPosition || [18.9910, 72.8356]} // Default to Lalbaug Kitchen
      zoom={13} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} />
      <LocateControl setPosition={setPosition} />
    </MapContainer>
  )
}
