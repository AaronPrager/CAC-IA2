import { ContractPharmacy, PharmacyNetwork } from './types'

// HRSA 340B OPAIS Data URLs
const HRSA_340B_URLS = {
  dailyReports: 'https://www.hrsa.gov/opa/340b-opais-daily-reports',
  coveredEntities: 'https://www.hrsa.gov/opa/covered-entities',
  contractPharmacies: 'https://www.hrsa.gov/opa/contract-pharmacies'
}

// Sample 340B contract pharmacy data for our districts
export const sampleContractPharmacies: ContractPharmacy[] = [
  {
    id: 'CP-MA-001',
    name: 'CVS Pharmacy - Provincetown',
    type: '340B Contract Pharmacy',
    address: {
      street: '185 Commercial Street',
      city: 'Provincetown',
      state: 'MA',
      zipCode: '02657',
      coordinates: [42.0587, -70.1787]
    },
    coveredEntityId: 'CE-MA-001',
    coveredEntityName: 'Community Health Center of Cape Cod',
    services: ['Prescription Dispensing', '340B Pricing', 'Patient Assistance'],
    hours: 'Mon-Fri 8AM-9PM, Sat 9AM-6PM, Sun 10AM-6PM',
    phone: '(508) 487-9395',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'CP-MA-002',
    name: 'Walgreens - Vineyard Haven',
    type: '340B Contract Pharmacy',
    address: {
      street: '123 Main Street',
      city: 'Vineyard Haven',
      state: 'MA',
      zipCode: '02568',
      coordinates: [41.4545, -70.5995]
    },
    coveredEntityId: 'CE-MA-002',
    coveredEntityName: 'Martha\'s Vineyard Community Services',
    services: ['Prescription Dispensing', '340B Pricing', 'Diabetes Care'],
    hours: 'Mon-Fri 8AM-8PM, Sat 9AM-6PM, Sun 10AM-6PM',
    phone: '(508) 693-7900',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'CP-CA-001',
    name: 'Rite Aid - San Jose',
    type: '340B Contract Pharmacy',
    address: {
      street: '789 S Bascom Ave',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95128',
      coordinates: [37.3382, -121.8863]
    },
    coveredEntityId: 'CE-CA-001',
    coveredEntityName: 'Santa Clara Valley Medical Center',
    services: ['Prescription Dispensing', '340B Pricing', 'Specialty Medications'],
    hours: 'Mon-Fri 7AM-9PM, Sat 8AM-8PM, Sun 9AM-6PM',
    phone: '(408) 885-5000',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'CP-GA-001',
    name: 'Walmart Pharmacy - Atlanta',
    type: '340B Contract Pharmacy',
    address: {
      street: '100 Jesse Hill Jr Dr SE',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30303',
      coordinates: [33.7490, -84.3880]
    },
    coveredEntityId: 'CE-GA-001',
    coveredEntityName: 'Grady Health System',
    services: ['Prescription Dispensing', '340B Pricing', 'Patient Education'],
    hours: 'Mon-Fri 8AM-8PM, Sat 9AM-6PM, Sun 10AM-6PM',
    phone: '(404) 616-1000',
    lastUpdated: '2024-01-15T12:00:00Z'
  }
]

// Calculate pharmacy network density for a district
export function calculatePharmacyNetworkDensity(
  districtCoordinates: [number, number],
  contractPharmacies: ContractPharmacy[]
): {
  totalPharmacies: number
  averageDistance: number
  networkDensityScore: number
  nearestPharmacy: ContractPharmacy
} {
  if (contractPharmacies.length === 0) {
    return {
      totalPharmacies: 0,
      averageDistance: 999,
      networkDensityScore: 0,
      nearestPharmacy: contractPharmacies[0]
    }
  }

  // Calculate distances to all contract pharmacies
  const pharmacyDistances = contractPharmacies.map(pharmacy => ({
    pharmacy,
    distance: calculateDistance(
      districtCoordinates[0],
      districtCoordinates[1],
      pharmacy.address.coordinates[0],
      pharmacy.address.coordinates[1]
    )
  }))

  // Find nearest pharmacy
  const nearestPharmacy = pharmacyDistances.reduce((a, b) => 
    a.distance < b.distance ? a : b
  ).pharmacy

  // Calculate average distance
  const averageDistance = pharmacyDistances.reduce((sum, item) => 
    sum + item.distance, 0
  ) / pharmacyDistances.length

  // Calculate network density score (0-100, lower is better)
  // Based on number of pharmacies and average distance
  let networkDensityScore = 0
  
  // Distance factor (0-60 points)
  if (averageDistance <= 2) {
    networkDensityScore += 60
  } else if (averageDistance <= 5) {
    networkDensityScore += 40
  } else if (averageDistance <= 10) {
    networkDensityScore += 20
  }

  // Density factor (0-40 points)
  if (contractPharmacies.length >= 5) {
    networkDensityScore += 40
  } else if (contractPharmacies.length >= 3) {
    networkDensityScore += 30
  } else if (contractPharmacies.length >= 2) {
    networkDensityScore += 20
  } else {
    networkDensityScore += 10
  }

  return {
    totalPharmacies: contractPharmacies.length,
    averageDistance: Math.round(averageDistance * 10) / 10,
    networkDensityScore: Math.min(networkDensityScore, 100),
    nearestPharmacy
  }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
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

// Fetch contract pharmacy data for a specific district
export async function fetchContractPharmacies(districtId: string): Promise<PharmacyNetwork | null> {
  try {
    // In a real implementation, this would fetch from HRSA 340B OPAIS
    // For now, we'll use sample data and filter by district
    
    // Filter pharmacies by state based on district ID
    const stateCode = districtId.split('-')[0]
    const districtPharmacies = sampleContractPharmacies.filter(pharmacy => 
      pharmacy.address.state === stateCode
    )

    if (districtPharmacies.length === 0) {
      return null
    }

    // Get district coordinates (this would come from district data)
    const districtCoordinates: [number, number] = [42.3601, -71.0589] // Default to MA-04
    
    const networkData = calculatePharmacyNetworkDensity(
      districtCoordinates,
      districtPharmacies
    )

    return {
      districtId,
      contractPharmacies: districtPharmacies,
      ...networkData,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching contract pharmacy data:', error)
    return null
  }
}

// Fetch all contract pharmacy data for all districts
export async function fetchAllContractPharmacies(): Promise<PharmacyNetwork[]> {
  const districts = ['MA-04', 'CA-16', 'GA-07']
  const results: PharmacyNetwork[] = []
  
  for (const districtId of districts) {
    const data = await fetchContractPharmacies(districtId)
    if (data) {
      results.push(data)
    }
  }
  
  return results
}
