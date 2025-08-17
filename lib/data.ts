import { District, DistrictScore, Alert, ApiResponse, PaginatedResponse } from './types'

// Mock data for development
const mockDistricts: District[] = [
  {
    id: 'MA-04',
    name: 'Massachusetts 4th District',
    state: 'Massachusetts',
    stateCode: 'MA',
    population: 734823,
    area: 325,
    coordinates: [42.3601, -71.0589],
    bounds: [[42.2, -71.2], [42.5, -70.9]],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-71.2, 42.2],
        [-70.9, 42.2],
        [-70.9, 42.5],
        [-71.2, 42.5],
        [-71.2, 42.2]
      ]]
    },
    insulinAccessRisk: {
      riskLevel: 'medium',
      riskScore: 65,
      factors: {
        uninsuredRate: 8.2,
        diabetesPrevalence: 9.1,
        pharmacyAccess: 78,
        incomeLevel: 125000,
        ruralAccess: 25
      },
      lastUpdated: '2024-01-15T12:00:00Z'
    },
    representative: {
      name: 'Jake Auchincloss',
      party: 'Democratic',
      phone: '(202) 225-5931',
      email: 'district4@mail.house.gov',
      officeAddress: 'Washington, DC',
      committeeMemberships: ['Armed Services', 'Transportation'],
      insulinVotingRecord: {
        supportForInsulinBills: 85,
        recentVotes: [
          {
            bill: 'HR 1234',
            vote: 'yes',
            date: '2024-01-10'
          }
        ]
      }
    }
  },
  {
    id: 'CA-16',
    name: 'California 16th District',
    state: 'California',
    stateCode: 'CA',
    population: 761387,
    area: 412,
    coordinates: [37.3382, -121.8863],
    bounds: [[37.2, -122.0], [37.5, -121.7]],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-122.0, 37.2],
        [-121.7, 37.2],
        [-121.7, 37.5],
        [-122.0, 37.5],
        [-122.0, 37.2]
      ]]
    },
    insulinAccessRisk: {
      riskLevel: 'low',
      riskScore: 35,
      factors: {
        uninsuredRate: 6.1,
        diabetesPrevalence: 7.8,
        pharmacyAccess: 95,
        incomeLevel: 145000,
        ruralAccess: 15
      },
      lastUpdated: '2024-01-15T12:00:00Z'
    },
    representative: {
      name: 'Anna Eshoo',
      party: 'Democratic',
      phone: '(202) 225-8104',
      email: 'district16@mail.house.gov',
      officeAddress: 'Washington, DC',
      committeeMemberships: ['Energy and Commerce', 'Intelligence'],
      insulinVotingRecord: {
        supportForInsulinBills: 92,
        recentVotes: [
          {
            bill: 'HR 1234',
            vote: 'yes',
            date: '2024-01-10'
          }
        ]
      }
    }
  },
  {
    id: 'GA-07',
    name: 'Georgia 7th District',
    state: 'Georgia',
    stateCode: 'GA',
    population: 789234,
    area: 298,
    coordinates: [33.7490, -84.3880],
    bounds: [[33.6, -84.5], [33.9, -84.2]],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-84.5, 33.6],
        [-84.2, 33.6],
        [-84.2, 33.9],
        [-84.5, 33.9],
        [-84.5, 33.6]
      ]]
    },
    insulinAccessRisk: {
      riskLevel: 'high',
      riskScore: 78,
      factors: {
        uninsuredRate: 15.2,
        diabetesPrevalence: 12.3,
        pharmacyAccess: 65,
        incomeLevel: 85000,
        ruralAccess: 45
      },
      lastUpdated: '2024-01-15T12:00:00Z'
    },
    representative: {
      name: 'Lucy McBath',
      party: 'Democratic',
      phone: '(202) 225-4272',
      email: 'district7@mail.house.gov',
      officeAddress: 'Washington, DC',
      committeeMemberships: ['Judiciary', 'Education and Labor'],
      insulinVotingRecord: {
        supportForInsulinBills: 78,
        recentVotes: [
          {
            bill: 'HR 1234',
            vote: 'yes',
            date: '2024-01-10'
          }
        ]
      }
    }
  }
]

const mockScores: DistrictScore[] = [
  {
    districtId: 'MA-04',
    economic: 85,
    demographic: 78,
    education: 92,
    health: 88,
    infrastructure: 76,
    overall: 84,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    districtId: 'CA-16',
    economic: 91,
    demographic: 85,
    education: 89,
    health: 94,
    infrastructure: 82,
    overall: 88,
    lastUpdated: '2024-01-15T09:15:00Z'
  },
  {
    districtId: 'GA-07',
    economic: 72,
    demographic: 68,
    education: 75,
    health: 71,
    infrastructure: 69,
    overall: 71,
    lastUpdated: '2024-01-15T11:45:00Z'
  }
]

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Insulin Access Risk Increased',
    message: 'MA-04 district shows 15% increase in insulin access risk factors',
    severity: 'warning',
    source: 'health',
    districtId: 'MA-04',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'active',
    previousValue: 65,
    currentValue: 75,
    change: 10,
    changePercent: 15.4,
    changeDirection: 'up',
    weekOverWeek: {
      previousWeek: 65,
      currentWeek: 75,
      change: 10,
      changePercent: 15.4
    }
  },
  {
    id: '2',
    title: 'Pharmacy Access Improved',
    message: 'CA-16 district pharmacy access increased by 8%',
    severity: 'info',
    source: 'health',
    districtId: 'CA-16',
    timestamp: '2024-01-14T14:20:00Z',
    status: 'active',
    previousValue: 95,
    currentValue: 103,
    change: 8,
    changePercent: 8.4,
    changeDirection: 'up',
    weekOverWeek: {
      previousWeek: 95,
      currentWeek: 103,
      change: 8,
      changePercent: 8.4
    }
  },
  {
    id: '3',
    title: 'Uninsured Rate Decreased',
    message: 'GA-07 district uninsured rate dropped by 12%',
    severity: 'info',
    source: 'census',
    districtId: 'GA-07',
    timestamp: '2024-01-13T09:15:00Z',
    status: 'active',
    previousValue: 15.2,
    currentValue: 13.4,
    change: -1.8,
    changePercent: -11.8,
    changeDirection: 'down',
    weekOverWeek: {
      previousWeek: 15.2,
      currentWeek: 13.4,
      change: -1.8,
      changePercent: -11.8
    }
  }
]

// API functions
export async function fetchDistricts(): Promise<ApiResponse<District[]>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      data: mockDistricts,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch districts',
      timestamp: new Date().toISOString()
    }
  }
}

export async function fetchDistrictById(id: string): Promise<ApiResponse<District>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const district = mockDistricts.find(d => d.id === id)
    if (!district) {
      throw new Error('District not found')
    }
    
    return {
      success: true,
      data: district,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch district',
      timestamp: new Date().toISOString()
    }
  }
}

export async function fetchDistrictScores(districtId?: string): Promise<ApiResponse<DistrictScore[]>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    let scores = mockScores
    if (districtId) {
      scores = scores.filter(s => s.districtId === districtId)
    }
    
    return {
      success: true,
      data: scores,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch district scores',
      timestamp: new Date().toISOString()
    }
  }
}

export async function fetchAlerts(filters?: {
  searchTerm?: string
  source?: string
  severity?: string
  districtId?: string
}): Promise<PaginatedResponse<Alert>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    let filteredAlerts = [...mockAlerts]
    
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filteredAlerts = filteredAlerts.filter(alert =>
        alert.title.toLowerCase().includes(term) ||
        alert.message.toLowerCase().includes(term) ||
        alert.districtId.toLowerCase().includes(term)
      )
    }
    
    if (filters?.source && filters.source !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.source === filters.source)
    }
    
    if (filters?.severity && filters.severity !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity)
    }
    
    if (filters?.districtId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.districtId === filters.districtId)
    }
    
    return {
      success: true,
      data: filteredAlerts,
      pagination: {
        page: 1,
        limit: 50,
        total: filteredAlerts.length,
        totalPages: 1
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch alerts',
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
      },
      timestamp: new Date().toISOString()
    }
  }
}

// Utility functions
export function calculateOverallScore(scores: Omit<DistrictScore, 'overall' | 'lastUpdated'>): number {
  const { economic, demographic, education, health, infrastructure } = scores
  return Math.round((economic + demographic + education + health + infrastructure) / 5)
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInHours / 24)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-100'
    case 'warning':
      return 'text-yellow-600 bg-yellow-100'
    case 'info':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}
