'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'

interface District {
  id: string
  name: string
  state: string
  member: string
  metrics: {
    risk_score: number
  }
}

interface DistrictListProps {
  districts: District[]
  onDistrictSelect: (districtId: string) => void
  selectedDistrictId?: string
}

export default function DistrictList({ districts, onDistrictSelect, selectedDistrictId }: DistrictListProps) {
  const [sortBy, setSortBy] = useState<'name' | 'risk_score' | 'state'>('risk_score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')

  // Debug logging
  console.log('DistrictList received:', { 
    districtsCount: districts.length, 
    selectedDistrictId, 
    hasOnDistrictSelect: typeof onDistrictSelect === 'function',
    firstFewDistricts: districts.slice(0, 3).map(d => d.id)
  })

  const sortedAndFilteredDistricts = useMemo(() => {
    let filtered = districts.filter(district => 
      district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'state':
          aValue = a.state
          bValue = b.state
          break
        case 'risk_score':
        default:
          aValue = a.metrics.risk_score
          bValue = b.metrics.risk_score
          break
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
      }
    })

    return filtered
  }, [districts, searchTerm, sortBy, sortOrder])

  const getRiskLevel = (score: number) => {
    if (score <= 35) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle }
    if (score <= 65) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle }
    return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle }
  }

  const handleSort = (field: 'name' | 'risk_score' | 'state') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortButton = ({ field, children }: { field: 'name' | 'risk_score' | 'state', children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span>{children}</span>
      {sortBy === field && (
        <span className="text-gray-400">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Congressional Districts</h3>
          <div className="text-sm text-gray-500">
            {sortedAndFilteredDistricts.length} of {districts.length} districts
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search districts, states, or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="name">District</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="state">State</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="risk_score">Risk Level</SortButton>
              </th>
              <th className="px-6 py-3 text-left">Representative</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredDistricts.map((district) => {
              const riskInfo = getRiskLevel(district.metrics.risk_score)
              const IconComponent = riskInfo.icon
              const isSelected = selectedDistrictId === district.id
              
              return (
                <tr 
                  key={district.id}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                  }`}
                  onClick={() => {
                    console.log('Row clicked for district:', district.id)
                    onDistrictSelect(district.id)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {district.id}
                      </div>
                      <div className="ml-2 text-sm text-gray-500">
                        {district.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{district.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskInfo.bgColor} ${riskInfo.color}`}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {riskInfo.level}
                      </div>
                      <div className="text-sm text-gray-500">
                        {district.metrics.risk_score}/100
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{district.member}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="flex items-center text-primary-600 hover:text-primary-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent row click from interfering
                        console.log('View Details clicked for district:', district.id)
                        onDistrictSelect(district.id)
                      }}
                    >
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedAndFilteredDistricts.length === 0 && (
        <div className="px-6 py-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No districts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  )
}
