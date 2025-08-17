'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  onDistrictSelect: (districtId: string) => void
}

export default function Map({ onDistrictSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4)
    mapInstanceRef.current = map

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Sample district data with insulin access risk - in real app, this would come from API
    const sampleDistricts = [
      {
        id: 'MA-04',
        name: 'Massachusetts 4th District',
        center: [42.3601, -71.0589] as [number, number],
        bounds: [[42.2, -71.2], [42.5, -70.9]] as [[number, number], [number, number]],
        riskLevel: 'medium',
        riskScore: 65
      },
      {
        id: 'CA-16',
        name: 'California 16th District',
        center: [37.3382, -121.8863] as [number, number],
        bounds: [[37.2, -122.0], [37.5, -121.7]] as [[number, number], [number, number]],
        riskLevel: 'low',
        riskScore: 35
      },
      {
        id: 'GA-07',
        name: 'Georgia 7th District',
        center: [33.7490, -84.3880] as [number, number],
        bounds: [[33.6, -84.5], [33.9, -84.2]] as [[number, number], [number, number]],
        riskLevel: 'high',
        riskScore: 78
      }
    ]

    // Add district markers
    sampleDistricts.forEach(district => {
      const marker = L.marker(district.center)
        .addTo(map)
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 mb-2">${district.name}</h3>
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-600">Insulin Access Risk:</span>
                <span class="text-sm font-medium ${district.riskLevel === 'low' ? 'text-green-600' : district.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}">${district.riskLevel.toUpperCase()}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full ${district.riskLevel === 'low' ? 'bg-green-500' : district.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}" style="width: ${district.riskScore}%"></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">Risk Score: ${district.riskScore}/100</div>
            </div>
            <button 
              onclick="window.selectDistrict('${district.id}')"
              class="w-full px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
            >
              View Action Plan
            </button>
          </div>
        `)

      // Add click handler
      marker.on('click', () => {
        onDistrictSelect(district.id)
      })
    })

    // Add sample GeoJSON district boundaries (simplified)
    const sampleGeoJSON: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: sampleDistricts.map(district => ({
        type: 'Feature',
        properties: {
          id: district.id,
          name: district.name
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [district.bounds[0][1], district.bounds[0][0]],
            [district.bounds[1][1], district.bounds[0][0]],
            [district.bounds[1][1], district.bounds[1][0]],
            [district.bounds[0][1], district.bounds[1][0]],
            [district.bounds[0][1], district.bounds[0][0]]
          ]]
        }
      }))
    }

    // Add GeoJSON layer
    L.geoJSON(sampleGeoJSON, {
      style: {
        color: '#3b82f6',
        weight: 2,
        opacity: 0.8,
        fillColor: '#3b82f6',
        fillOpacity: 0.1
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          onDistrictSelect(feature.properties.id)
        })
      }
    }).addTo(map)

    // Add global function for popup buttons
    ;(window as any).selectDistrict = onDistrictSelect

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [onDistrictSelect])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Risk Legend */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-3">
        <div className="text-xs text-gray-600 font-medium mb-2">Insulin Access Risk</div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <span className="text-xs text-gray-700">Low (0-25)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
            <span className="text-xs text-gray-700">Medium (26-50)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
            <span className="text-xs text-gray-700">High (51-75)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            <span className="text-xs text-gray-700">Critical (76-100)</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">Low → High Risk</div>
        </div>
      </div>
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
        <div className="text-xs text-gray-600 font-medium mb-1">Map Controls</div>
        <div className="flex space-x-2">
          <button
            onClick={() => mapInstanceRef.current?.setView([39.8283, -98.5795], 4)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded transition-colors"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded transition-colors"
          >
            -
          </button>
        </div>
      </div>
    </div>
  )
}
