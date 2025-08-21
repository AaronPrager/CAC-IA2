'use client'

import { useState, useEffect } from 'react'

interface StateDistrictSelectorProps {
  onStateChange: (state: string) => void
  onDistrictChange: (districtId: string) => void
  selectedState: string
  selectedDistrict: string
}

interface District {
  id: string
  name: string
  state: string
  member: string
  metrics: {
    risk_score: number
  }
}

interface State {
  code: string
  name: string
  districts: Array<{
    id: string
    name: string
    number: string
  }>
}

// State names mapping
const stateNames: { [key: string]: string } = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
}

export default function StateDistrictSelector({ 
  onStateChange, 
  onDistrictChange, 
  selectedState, 
  selectedDistrict 
}: StateDistrictSelectorProps) {
  const [states, setStates] = useState<State[]>([])
  const [districts, setDistricts] = useState<Array<{id: string, name: string, number: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStatesAndDistricts = async () => {
      try {
        console.log('StateDistrictSelector: Loading data from /data/districts.json')
        const response = await fetch('/data/districts.json')
        console.log('StateDistrictSelector: Response status:', response.status, response.ok)
        if (response.ok) {
          const data = await response.json()
          console.log('StateDistrictSelector: Loaded data:', data)
          const districtsData: District[] = data.districts || []
          console.log('StateDistrictSelector: Districts count:', districtsData.length)
          
          // Group districts by state
          const stateMap = new Map<string, District[]>()
          districtsData.forEach(district => {
            if (!stateMap.has(district.state)) {
              stateMap.set(district.state, [])
            }
            stateMap.get(district.state)!.push(district)
          })
          
          // Convert to State objects
          const statesList: State[] = Array.from(stateMap.entries()).map(([stateCode, stateDistricts]) => {
            const districtsList = stateDistricts.map(district => {
              // Extract district number from ID (e.g., "CA-16" -> "16")
              const districtNumber = district.id.split('-')[1]
              console.log(`Processing district ${district.id}, extracted number: ${districtNumber}`)
              return {
                id: district.id,
                name: district.name,
                number: districtNumber || 'Unknown'
              }
            })
            
            return {
              code: stateCode,
              name: stateNames[stateCode] || stateCode,
              districts: districtsList.sort((a, b) => parseInt(a.number) - parseInt(b.number))
            }
          })
          
          // Sort states alphabetically by name
          statesList.sort((a, b) => a.name.localeCompare(b.name))
          
          setStates(statesList)
        }
      } catch (error) {
        console.error('Failed to load states and districts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStatesAndDistricts()
  }, [])

  useEffect(() => {
    if (selectedState) {
      const state = states.find(s => s.code === selectedState)
      if (state) {
        console.log('StateDistrictSelector: Setting districts for state', selectedState, ':', state.districts)
        setDistricts(state.districts)
        // Reset district selection when state changes
        onDistrictChange('')
      }
    } else {
      setDistricts([])
    }
  }, [selectedState, states, onDistrictChange])

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value
    onStateChange(stateCode)
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value
    console.log('🎯 DISTRICT DROPDOWN CHANGED!')
    console.log('StateDistrictSelector: District dropdown changed to:', districtId)
    console.log('StateDistrictSelector: Calling onDistrictChange with:', districtId)
    console.log('StateDistrictSelector: onDistrictChange function exists:', typeof onDistrictChange)
    
    try {
      onDistrictChange(districtId)
      console.log('StateDistrictSelector: onDistrictChange called successfully')
    } catch (error) {
      console.error('StateDistrictSelector: Error calling onDistrictChange:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="text-sm text-gray-700 font-medium mb-3">Select State & District</div>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading states and districts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="text-sm text-gray-700 font-medium mb-3">Select State & District</div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name} ({state.districts.length} districts)
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-2">
            Congressional District
          </label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedState}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a district</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                District {district.number} - {district.name}
              </option>
            ))}
          </select>
          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-1">
            Debug: {districts.length} districts available, selected: {selectedDistrict || 'none'}
          </div>
        </div>
      </div>
      
      {selectedState && selectedDistrict && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm text-blue-800">
            <span className="font-medium">Selected:</span> {states.find(s => s.code === selectedState)?.name} - {districts.find(d => d.id === selectedDistrict)?.name}
          </div>
        </div>
      )}
      
      {selectedState && !selectedDistrict && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm text-gray-600">
            <span className="font-medium">State:</span> {states.find(s => s.code === selectedState)?.name} 
            <span className="ml-2 text-xs text-gray-500">
              ({districts.length} congressional districts available)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
