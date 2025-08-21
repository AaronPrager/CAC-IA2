'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ChevronDown, MapPin, AlertTriangle, TrendingUp, Users, FileText } from 'lucide-react'

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(() => import('./(components)/Map'), { ssr: false })
const DistrictDrawer = dynamic(() => import('./(components)/DistrictDrawer'), { ssr: false })

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

export default function HomePage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedDistrictData, setSelectedDistrictData] = useState<District | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Load districts data
  useEffect(() => {
    console.log('🚀 Loading districts data...')
    fetch('/data/districts.json')
      .then(response => response.json())
      .then(data => {
        console.log('✅ Districts loaded:', data.districts?.length || 0)
        setDistricts(data.districts || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('❌ Error loading districts:', error)
        setLoading(false)
      })
  }, [])

  // Handle state selection
  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    setSelectedDistrict('') // Reset district selection when state changes
    setSelectedDistrictData(null)
    setIsDrawerOpen(false)
  }

  // Handle district selection
  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId)
    const district = districts.find(d => d.id === districtId)
    setSelectedDistrictData(district || null)
    setIsDrawerOpen(true)
  }

  // Close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedDistrict('')
    setSelectedDistrictData(null)
  }

  // Get filtered districts based on selection
  const getFilteredDistricts = () => {
    if (selectedState) {
      return districts.filter(d => d.state === selectedState)
    }
    return districts
  }

  // Get statistics for selected state/district
  const getStatistics = () => {
    const filteredDistricts = getFilteredDistricts()
    const totalDistricts = filteredDistricts.length
    const highRisk = filteredDistricts.filter(d => d.metrics?.risk_score > 65).length
    const mediumRisk = filteredDistricts.filter(d => d.metrics?.risk_score > 25 && d.metrics?.risk_score <= 65).length
    const lowRisk = filteredDistricts.filter(d => d.metrics?.risk_score <= 25).length
    const avgRiskScore = totalDistricts > 0 
      ? Math.round(filteredDistricts.reduce((sum, d) => sum + (d.metrics?.risk_score || 0), 0) / totalDistricts)
      : 0

    return { totalDistricts, highRisk, mediumRisk, lowRisk, avgRiskScore }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading districts...</p>
        </div>
      </div>
    )
  }

  const stats = getStatistics()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Insulin Access Dashboard</h1>
            <nav className="flex space-x-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Risk Map
              </Link>
              <Link href="/legislation" className="text-gray-500 hover:text-gray-700">
                Legislation
              </Link>
              <Link href="/actions" className="text-gray-500 hover:text-gray-700">
                Take Action
              </Link>
              <Link href="/alerts" className="text-gray-500 hover:text-gray-700">
                Alerts
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-700">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Districts</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDistricts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">High Risk</h3>
                <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Medium Risk</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.mediumRisk}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Avg Risk Score</h3>
                <p className="text-2xl font-bold text-green-600">{stats.avgRiskScore}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section with Selection Controls Above */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {selectedState ? `${selectedState} Congressional Districts` : 'Insulin Access Risk Map'}
          </h2>
          
          {/* State & District Selector - Now positioned above the map */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Select State & District
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* State Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <div className="relative">
                  <select 
                    value={selectedState}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    onChange={(e) => handleStateSelect(e.target.value)}
                  >
                    <option value="">All States</option>
                    {Array.from(new Set(districts.map(d => d.state))).sort().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* District Selector - Only show when state is selected */}
              {selectedState && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <div className="relative">
                    <select 
                      value={selectedDistrict}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      onChange={(e) => handleDistrictSelect(e.target.value)}
                    >
                      <option value="">All Districts in {selectedState}</option>
                      {districts
                        .filter(d => d.state === selectedState)
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map(district => (
                          <option key={district.id} value={district.id}>
                            {district.name} - {district.member}
                          </option>
                        ))
                      }
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                {selectedState 
                  ? `📍 Showing ${stats.totalDistricts} districts in ${selectedState}`
                  : `🗺️ Showing ${stats.totalDistricts} districts across ${Array.from(new Set(districts.map(d => d.state))).length} states`
                }
                {selectedDistrict && ` • Selected: ${selectedDistrict}`}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            {selectedState 
              ? `Showing ${stats.totalDistricts} districts from ${selectedState}`
              : `Showing ${stats.totalDistricts} districts across all states`
            }
            {selectedDistrict && ` • Focused on ${selectedDistrict}`}
          </p>
          
          <Map 
            districts={getFilteredDistricts()}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            onDistrictClick={handleDistrictSelect}
          />
        </div>

        {/* District List with Risk Scores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            {selectedState ? `${selectedState} Districts` : 'All Districts'} - Risk Analysis
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Representative
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredDistricts()
                  .sort((a, b) => (b.metrics?.risk_score || 0) - (a.metrics?.risk_score || 0)) // Sort by risk score (high to low)
                  .map((district) => {
                    const riskScore = district.metrics?.risk_score || 0
                    let riskLevel: string
                    let riskColor: string
                    let bgColor: string
                    
                    if (riskScore <= 25) {
                      riskLevel = 'Low Risk'
                      riskColor = 'text-green-600'
                      bgColor = 'bg-green-100'
                    } else if (riskScore <= 65) {
                      riskLevel = 'Medium Risk'
                      riskColor = 'text-yellow-600'
                      bgColor = 'bg-yellow-100'
                    } else {
                      riskLevel = 'High Risk'
                      riskColor = 'text-red-600'
                      bgColor = 'bg-red-100'
                    }

                    return (
                      <tr 
                        key={district.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedDistrict === district.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => handleDistrictSelect(district.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${bgColor.replace('bg-', 'bg-').replace('-100', '-600')}`}>
                                {district.state}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{district.name}</div>
                              <div className="text-sm text-gray-500">{district.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{district.member}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16">
                              <span className={`text-lg font-bold ${riskColor}`}>
                                {riskScore}/100
                              </span>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${riskScore <= 25 ? 'bg-green-500' : riskScore <= 65 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${riskScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${riskColor}`}>
                            {riskLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDistrictSelect(district.id)
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          
          {getFilteredDistricts().length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">No districts found for the current selection.</div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Risk Score Breakdown:</strong> 
              Low (0-25) • Medium (26-65) • High (66-100)
              {selectedState && ` • Showing ${getFilteredDistricts().length} districts in ${selectedState}`}
              {selectedDistrict && ` • ${selectedDistrict} is highlighted`}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/alerts" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Alerts</h3>
                <p className="text-gray-600">Check for critical insulin access issues</p>
              </div>
            </div>
          </Link>
          
          <Link href="/legislation" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Legislation</h3>
                <p className="text-gray-600">Track insulin-related bills and policies</p>
              </div>
            </div>
          </Link>
          
          <Link href="/actions" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Take Action</h3>
                <p className="text-gray-600">Get involved and make a difference</p>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* District Drawer */}
      {isDrawerOpen && selectedDistrictData && (
        <DistrictDrawer
          districtId={selectedDistrict}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  )
}