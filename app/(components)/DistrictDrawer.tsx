'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, FileText, AlertTriangle, Users, Phone, Mail, Download } from 'lucide-react'
import ScoreBars from '@/app/(components)/ScoreBars'
import SourceBadge from '@/app/(components)/SourceBadge'

interface DistrictDrawerProps {
  districtId: string | null
  onClose: () => void
}

interface DistrictData {
  id: string
  name: string
  state: string
  member: string
  metrics: {
    access_proximity: number
    coverage_friction: number
    availability: number
    price_pressure: number
    risk_score: number
  }
  drivers: string[]
  resources: {
    hrsa_clinic_finder: string
    state_medicaid_info: string
    manufacturer_assistance: Array<{
      name: string
      url: string
    }>
  }
  legislative_links: Array<{
    type: string
    title: string
    url: string
    date: string
  }>
  sites: Array<{
    site_type: string
    name: string
    lat: number
    lon: number
  }>
  provenance: {
    sources: Array<{
      name: string
      url: string
      last_pull: string
    }>
    notes: string
  }
}

export default function DistrictDrawer({ districtId, onClose }: DistrictDrawerProps) {
  const [districtData, setDistrictData] = useState<DistrictData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Debug logging
  console.log('DistrictDrawer render:', { districtId, districtData, loading, error, isVisible })

  // Component mount/unmount logging
  useEffect(() => {
    console.log('DistrictDrawer mounted with districtId:', districtId)
    return () => {
      console.log('DistrictDrawer unmounting for districtId:', districtId)
    }
  }, [districtId])

  useEffect(() => {
    console.log('DistrictDrawer useEffect triggered with districtId:', districtId)
    
    if (!districtId) {
      console.log('No districtId, clearing data and hiding')
      setDistrictData(null)
      setIsVisible(false)
      return
    }

    // Set visible immediately when we have a districtId
    console.log('Setting drawer visible for district:', districtId)
    setIsVisible(true)

    const fetchDistrictData = async () => {
      console.log('Fetching data for district:', districtId)
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/data/districts/${districtId}.json`)
        if (!response.ok) {
          throw new Error(`Failed to fetch district data: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Fetched district data:', data)
        setDistrictData(data)
      } catch (err) {
        console.error('Error fetching district data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch district data')
        
        // Fallback to mock data if fetch fails
        const mockData: DistrictData = {
          id: districtId,
          name: `${districtId} District`,
          state: districtId.split('-')[0],
          member: `Rep. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
          metrics: {
            access_proximity: Math.floor(Math.random() * 60) + 20,
            coverage_friction: Math.floor(Math.random() * 60) + 20,
            availability: Math.floor(Math.random() * 60) + 20,
            price_pressure: Math.floor(Math.random() * 60) + 20,
            risk_score: Math.floor(Math.random() * 60) + 20
          },
          drivers: ['Recent FDA shortage signal', 'Longer travel to dispensing sites'],
          resources: {
            hrsa_clinic_finder: 'https://findahealthcenter.hrsa.gov/',
            state_medicaid_info: 'https://www.medicaid.gov/',
            manufacturer_assistance: [
              {
                name: 'Lilly Insulin Value Program',
                url: 'https://www.lilly.com/insulin'
              },
              {
                name: 'NovoCare',
                url: 'https://www.novocare.com/'
              }
            ]
          },
          legislative_links: [
            {
              type: 'bill',
              title: 'H.R. 1234 — Insulin Affordability Act',
              url: 'https://www.congress.gov/',
              date: '2025-07-10'
            },
            {
              type: 'bill',
              title: 'H.R. 5678 — Essential Medicines Access Act',
              url: 'https://www.congress.gov/',
              date: '2025-07-15'
            }
          ],
          sites: [
            {
              site_type: 'CHC',
              name: `${districtId} Site 1`,
              lat: 39.8283 + (Math.random() - 0.5) * 10,
              lon: -98.5795 + (Math.random() - 0.5) * 10
            },
            {
              site_type: '340B',
              name: `${districtId} Site 2`,
              lat: 39.8283 + (Math.random() - 0.5) * 10,
              lon: -98.5795 + (Math.random() - 0.5) * 10
            }
          ],
          provenance: {
            sources: [
              {
                name: 'HRSA Service Delivery Sites',
                url: 'https://data.hrsa.gov/',
                last_pull: '2025-08-10'
              },
              {
                name: '340B OPAIS Daily Report',
                url: 'https://www.hrsa.gov/opa',
                last_pull: '2025-08-10'
              }
            ],
            notes: 'Demo metrics only.'
          }
        }
        
        console.log('Using mock data:', mockData)
        setDistrictData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchDistrictData()
  }, [districtId])

  // Don't render if no districtId
  if (!districtId) {
    console.log('DistrictDrawer: No districtId, rendering hidden drawer')
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 transform translate-x-full transition-transform duration-300 ease-in-out z-[9999] district-drawer">
        {/* Hidden drawer - don't unmount */}
      </div>
    )
  }

  // Don't render if we're not visible yet
  if (!isVisible) {
    console.log('DistrictDrawer: Not visible yet, rendering hidden drawer')
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 transform translate-x-full transition-transform duration-300 ease-in-out z-[9999] district-drawer">
        {/* Hidden drawer - don't unmount */}
      </div>
    )
  }

  // Don't render if we don't have data yet and not loading
  if (!districtData && !loading) {
    console.log('DistrictDrawer: No data and not loading, rendering loading state')
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-[9999] district-drawer">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Loading...</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const generatePDF = async () => {
    if (!districtData) return

    try {
      // Dynamic import of html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = document.getElementById('district-drawer-content')
      if (!element) return

      const opt = {
        margin: 1,
        filename: `${districtData.id}-insulin-access-report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 transform translate-x-0 transition-transform duration-300 ease-in-out z-[9999] district-drawer">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {districtData?.name || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500">
                {districtData?.state || ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={generatePDF}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Generate PDF Report"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" id="district-drawer-content">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-1">Using sample data instead.</p>
            </div>
          )}

          {!loading && !error && districtData && (
            <div className="space-y-6">
              {/* Basic Info */}
              {districtData?.member && districtData?.state && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">District Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Member:</span>
                      <span className="ml-2 font-medium">{districtData.member}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">State:</span>
                      <span className="ml-2 font-medium">{districtData.state}</span>
                    </div>
                  </div>
                </div>
              )}

              {!districtData?.member || !districtData?.state ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Incomplete District Data</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">
                    Some district information is missing. Please check the data source.
                  </p>
                </div>
              ) : null}

              {/* Risk Assessment */}
              {districtData?.metrics && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-primary-600 mr-2" />
                    Insulin Access Risk Assessment
                  </h3>
                  <ScoreBars 
                    scores={{
                      'Access Proximity': districtData.metrics.access_proximity,
                      'Coverage Friction': districtData.metrics.coverage_friction,
                      'Availability': districtData.metrics.availability,
                      'Price Pressure': districtData.metrics.price_pressure
                    }}
                    overallRisk={districtData.metrics.risk_score}
                  />
                </div>
              )}

              {/* Risk Drivers */}
              {districtData?.drivers && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-primary-600 mr-2" />
                    Risk Drivers
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
                      {districtData.drivers.map((driver, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          <span className="text-gray-700">{driver}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Legislative Links */}
              {districtData?.legislative_links && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-primary-600 mr-2" />
                    Legislative Links
                  </h3>
                  <div className="space-y-3">
                    {districtData.legislative_links.map((legislation, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <a 
                              href={legislation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                            >
                              {legislation.title}
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Type: {legislation.type} • Date: {legislation.date}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            legislation.type === 'bill' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {legislation.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sites */}
              {districtData?.sites && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                    Data Sources & Sites
                  </h3>
                  <div className="space-y-3">
                    {districtData.sites.map((site, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {site.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {site.site_type} • Lat: {site.lat.toFixed(4)}, Lon: {site.lon.toFixed(4)}
                            </p>
                          </div>
                          <SourceBadge type={site.site_type} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {districtData?.resources && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 text-primary-600 mr-2" />
                    Resources & Assistance
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <a 
                          href={districtData.resources.hrsa_clinic_finder}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline block"
                        >
                          Find HRSA Health Centers
                        </a>
                        <a 
                          href={districtData.resources.state_medicaid_info}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline block"
                        >
                          State Medicaid Information
                        </a>
                      </div>
                    </div>
                    
                    {districtData.resources.manufacturer_assistance && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Manufacturer Assistance Programs</h4>
                        <div className="space-y-2">
                          {districtData.resources.manufacturer_assistance.map((program, index) => (
                            <a 
                              key={index}
                              href={program.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline block"
                            >
                              {program.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
