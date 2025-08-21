import { HealthCenter, ServiceSite, AccessProximityData } from './types'

// HRSA Data URLs (these would be updated regularly)
const HRSA_URLS = {
  healthCenters: 'https://data.hrsa.gov/api/healthcenters',
  serviceSites: 'https://data.hrsa.gov/api/servicesites',
  // Fallback to local data if HRSA is unavailable
  localHealthCenters: '/data/health-centers.json',
  localServiceSites: '/data/service-sites.json'
}

// Sample health center data for our demo districts
export const sampleHealthCenters: HealthCenter[] = [
  {
    id: 'HC-MA-001',
    name: 'Community Health Center of Cape Cod',
    type: 'FQHC',
    address: {
      street: '107 Commercial Street',
      city: 'Provincetown',
      state: 'MA',
      zipCode: '02657',
      coordinates: [42.0587, -70.1787]
    },
    services: ['Primary Care', 'Pharmacy', 'Diabetes Management', 'Mental Health'],
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-1PM',
    phone: '(508) 487-9395',
    website: 'https://www.capecodhealth.org',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'HC-MA-002',
    name: 'Martha\'s Vineyard Community Services',
    type: 'FQHC',
    address: {
      street: '111 Edgartown Road',
      city: 'Vineyard Haven',
      state: 'MA',
      zipCode: '02568',
      coordinates: [41.4545, -70.5995]
    },
    services: ['Primary Care', 'Pharmacy', 'Diabetes Education', 'Social Services'],
    hours: 'Mon-Fri 8AM-5PM',
    phone: '(508) 693-7900',
    website: 'https://www.mvcommunityservices.org',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'HC-CA-001',
    name: 'Santa Clara Valley Medical Center',
    type: 'FQHC',
    address: {
      street: '751 S Bascom Ave',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95128',
      coordinates: [37.3382, -121.8863]
    },
    services: ['Primary Care', 'Specialty Care', 'Pharmacy', 'Diabetes Management'],
    hours: 'Mon-Fri 7AM-7PM, Sat 8AM-4PM',
    phone: '(408) 885-5000',
    website: 'https://www.scvmc.org',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'HC-GA-001',
    name: 'Grady Health System',
    type: 'FQHC',
    address: {
      street: '80 Jesse Hill Jr Dr SE',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30303',
      coordinates: [33.7490, -84.3880]
    },
    services: ['Primary Care', 'Pharmacy', 'Diabetes Care', 'Mental Health'],
    hours: 'Mon-Fri 8AM-8PM, Sat 9AM-5PM',
    phone: '(404) 616-1000',
    website: 'https://www.gradyhealth.org',
    lastUpdated: '2024-01-15T12:00:00Z'
  }
]

export const sampleServiceSites: ServiceSite[] = [
  {
    id: 'SS-MA-001',
    healthCenterId: 'HC-MA-001',
    name: 'Cape Cod Health Center Pharmacy',
    type: 'Pharmacy',
    address: {
      street: '107 Commercial Street',
      city: 'Provincetown',
      state: 'MA',
      zipCode: '02657',
      coordinates: [42.0587, -70.1787]
    },
    insulinServices: {
      prescription: true,
      dispensing: true,
      education: true,
      financialAssistance: true
    },
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-1PM',
    phone: '(508) 487-9395',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'SS-CA-001',
    healthCenterId: 'HC-CA-001',
    name: 'Santa Clara Valley Pharmacy',
    type: 'Pharmacy',
    address: {
      street: '751 S Bascom Ave',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95128',
      coordinates: [37.3382, -121.8863]
    },
    insulinServices: {
      prescription: true,
      dispensing: true,
      education: true,
      financialAssistance: false
    },
    hours: 'Mon-Fri 7AM-7PM, Sat 8AM-4PM',
    phone: '(408) 885-5000',
    lastUpdated: '2024-01-15T12:00:00Z'
  }
]

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Calculate access proximity score for a district
export function calculateAccessProximity(
  districtCoordinates: [number, number],
  healthCenters: HealthCenter[],
  serviceSites: ServiceSite[]
): {
  averageDistance: number
  nearestCenter: HealthCenter
  nearestPharmacy: ServiceSite
  coverageScore: number
} {
  if (healthCenters.length === 0) {
    return {
      averageDistance: 999,
      nearestCenter: healthCenters[0],
      nearestPharmacy: serviceSites[0],
      coverageScore: 0
    }
  }

  // Calculate distances to all health centers
  const centerDistances = healthCenters.map(center => ({
    center,
    distance: calculateDistance(
      districtCoordinates[0],
      districtCoordinates[1],
      center.address.coordinates[0],
      center.address.coordinates[1]
    )
  }))

  // Calculate distances to pharmacy service sites
  const pharmacyDistances = serviceSites
    .filter(site => site.type === 'Pharmacy')
    .map(site => ({
      site,
      distance: calculateDistance(
        districtCoordinates[0],
        districtCoordinates[1],
        site.address.coordinates[0],
        site.address.coordinates[1]
      )
    }))

  // Find nearest health center and pharmacy
  const nearestCenter = centerDistances.reduce((a, b) => 
    a.distance < b.distance ? a : b
  ).center

  const nearestPharmacy = pharmacyDistances.length > 0 
    ? pharmacyDistances.reduce((a, b) => 
        a.distance < b.distance ? a : b
      ).site
    : serviceSites[0]

  // Calculate average distance
  const averageDistance = centerDistances.reduce((sum, item) => 
    sum + item.distance, 0
  ) / centerDistances.length

  // Calculate coverage score (0-100, lower is better)
  // 0-5 miles: 0-20 points, 5-15 miles: 20-60 points, 15+ miles: 60-100 points
  let coverageScore = 0
  if (averageDistance <= 5) {
    coverageScore = (averageDistance / 5) * 20
  } else if (averageDistance <= 15) {
    coverageScore = 20 + ((averageDistance - 5) / 10) * 40
  } else {
    coverageScore = 60 + Math.min(((averageDistance - 15) / 10) * 40, 40)
  }

  return {
    averageDistance: Math.round(averageDistance * 10) / 10,
    nearestCenter,
    nearestPharmacy,
    coverageScore: Math.round(coverageScore)
  }
}

// Fetch health center data for a specific district
export async function fetchHealthCenterData(districtId: string): Promise<AccessProximityData | null> {
  try {
    // In a real implementation, this would fetch from HRSA API
    // For now, we'll use sample data and filter by district
    
    // Filter health centers by state based on district ID
    const stateCode = districtId.split('-')[0]
    const districtHealthCenters = sampleHealthCenters.filter(center => 
      center.address.state === stateCode
    )
    
    const districtServiceSites = sampleServiceSites.filter(site => {
      const center = sampleHealthCenters.find(hc => hc.id === site.healthCenterId)
      return center && center.address.state === stateCode
    })

    if (districtHealthCenters.length === 0) {
      return null
    }

    // Get district coordinates (this would come from district data)
    const districtCoordinates: [number, number] = [42.3601, -71.0589] // Default to MA-04
    
    const proximityData = calculateAccessProximity(
      districtCoordinates,
      districtHealthCenters,
      districtServiceSites
    )

    return {
      districtId,
      healthCenters: districtHealthCenters,
      serviceSites: districtServiceSites,
      ...proximityData,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching health center data:', error)
    return null
  }
}

// Fetch all health center data (for bulk processing)
export async function fetchAllHealthCenterData(): Promise<AccessProximityData[]> {
  const districts = ['MA-04', 'CA-16', 'GA-07']
  const results: AccessProximityData[] = []
  
  for (const districtId of districts) {
    const data = await fetchHealthCenterData(districtId)
    if (data) {
      results.push(data)
    }
  }
  
  return results
}
