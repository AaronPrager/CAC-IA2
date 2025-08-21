'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface District {
  id: string
  name: string
  state: string
  member: string
  metrics: {
    risk_score: number
  }
  sites: Array<{
    lat: number
    lon: number
  }>
}

interface MapProps {
  districts: District[]
  selectedState?: string
  selectedDistrict?: string
  onDistrictClick?: (districtId: string) => void
}

export default function Map({ districts, selectedState, selectedDistrict, onDistrictClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])

  useEffect(() => {
    if (!mapRef.current || !districts.length) return

    console.log('🗺️ Initializing map with', districts.length, 'districts')

    // Clean up existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [39.8283, -98.5795], // US center
      zoom: 4,
      zoomControl: true,
      attributionControl: true
    })

    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add markers for each district
    districts.forEach((district) => {
      if (!district.metrics || !district.sites || district.sites.length === 0) {
        return
      }

      const riskScore = district.metrics.risk_score
      
      // Color based on risk score
      let color: string
      if (riskScore <= 25) {
        color = '#22c55e' // Green for low risk
      } else if (riskScore <= 65) {
        color = '#eab308' // Yellow for medium risk
      } else {
        color = '#ef4444' // Red for high risk
      }

      // Create marker
      const marker = L.circleMarker([district.sites[0].lat, district.sites[0].lon], {
        radius: 6,
        fillColor: color,
        color: '#1f2937',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map)

      // Store marker reference
      markersRef.current.push(marker)

      // Add popup
      const riskLevel = riskScore <= 25 ? 'LOW' : 
                       riskScore <= 65 ? 'MEDIUM' : 'HIGH'
      
      const popupContent = `
        <div style="padding: 16px; min-width: 220px; cursor: pointer;" class="district-popup-content">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></div>
            <h4 style="margin: 0; font-weight: 600; color: #1f2937; font-size: 16px;">${district.name}</h4>
          </div>
          
          <div style="margin-bottom: 8px;">
            <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;"><strong>Representative:</strong></p>
            <p style="margin: 0; font-size: 14px; color: #374151;">${district.member}</p>
          </div>
          
          <div style="margin-bottom: 8px;">
            <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;"><strong>Risk Assessment:</strong></p>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: ${color}; font-weight: 600; font-size: 14px;">${riskLevel}</span>
              <span style="color: #6b7280; font-size: 13px;">(${riskScore}/100)</span>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #cbd5e1;">
            <span style="color: #3b82f6; font-weight: 500; font-size: 13px;">Click to view full details →</span>
          </div>
        </div>
      `
      
      marker.bindPopup(popupContent, {
        closeButton: true,
        maxWidth: 280,
        className: 'custom-popup'
      })

      // Add click handler if callback is provided
      if (onDistrictClick) {
        marker.on('click', () => {
          onDistrictClick(district.id)
        })
        
        // Also handle popup click events
        marker.on('popupopen', () => {
          // Add event listener for the popup click
          const popup = marker.getPopup()
          if (popup) {
            const popupElement = popup.getElement()
            if (popupElement) {
              popupElement.addEventListener('click', () => {
                onDistrictClick(district.id)
              })
            }
          }
        })
      }
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [districts, onDistrictClick])

  // Handle zooming when state/district selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !districts.length) return

    const map = mapInstanceRef.current

    if (selectedDistrict) {
      // Zoom to specific district
      const district = districts.find(d => d.id === selectedDistrict)
      if (district && district.sites && district.sites.length > 0) {
        const [lat, lon] = [district.sites[0].lat, district.sites[0].lon]
        map.setView([lat, lon], 8, { animate: true, duration: 1 })
        
        // Highlight the selected district marker
        markersRef.current.forEach(marker => {
          const markerLat = marker.getLatLng().lat
          const markerLon = marker.getLatLng().lng
          if (Math.abs(markerLat - lat) < 0.001 && Math.abs(markerLon - lon) < 0.001) {
            marker.setStyle({ radius: 12, weight: 3 })
          } else {
            marker.setStyle({ radius: 6, weight: 1 })
          }
        })
      }
    } else if (selectedState) {
      // Zoom to state level
      const stateDistricts = districts.filter(d => d.state === selectedState)
      if (stateDistricts.length > 0) {
        const bounds = L.latLngBounds(
          stateDistricts
            .filter(d => d.sites && d.sites.length > 0)
            .map(d => [d.sites[0].lat, d.sites[0].lon])
        )
        map.fitBounds(bounds, { padding: [20, 20], animate: true, duration: 1 })
      }
    } else {
      // Reset to US view
      map.setView([39.8283, -98.5795], 4, { animate: true, duration: 1 })
      
      // Reset all marker styles
      markersRef.current.forEach(marker => {
        marker.setStyle({ radius: 6, weight: 1 })
      })
    }
  }, [selectedState, selectedDistrict, districts])

  return (
    <div className="w-full">
      {/* Risk Legend */}
      <div className="mb-4 bg-gray-50 rounded-lg p-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Low Risk (0-25)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk (36-65)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>High Risk (66-100)</span>
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="w-full h-96 rounded-lg border border-gray-200">
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </div>
    </div>
  )
}