import { DrugShortage, ShortageImpact } from './types'

// FDA Drug Shortage URLs
const FDA_URLS = {
  shortagesDatabase: 'https://www.fda.gov/drugs/drug-shortages',
  currentShortages: 'https://www.fda.gov/drugs/drug-shortages/current-shortages',
  resolvedShortages: 'https://www.fda.gov/drugs/drug-shortages/resolved-shortages'
}

// Sample drug shortage data for insulin products
export const sampleDrugShortages: DrugShortage[] = [
  {
    id: 'DS-001',
    drugName: 'Humalog (insulin lispro)',
    genericName: 'insulin lispro',
    ndc: '00002-7510-01',
    manufacturer: 'Eli Lilly and Company',
    shortageStatus: 'current',
    reason: 'Demand increase for the drug',
    estimatedResupply: '2024-03-15',
    impact: 'high',
    affectedAreas: ['Nationwide'],
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'DS-002',
    drugName: 'NovoLog (insulin aspart)',
    genericName: 'insulin aspart',
    ndc: '0169-1837-11',
    manufacturer: 'Novo Nordisk',
    shortageStatus: 'current',
    reason: 'Manufacturing delay',
    estimatedResupply: '2024-02-28',
    impact: 'medium',
    affectedAreas: ['Northeast', 'Midwest'],
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: 'DS-003',
    drugName: 'Lantus (insulin glargine)',
    genericName: 'insulin glargine',
    ndc: '00088-2837-33',
    manufacturer: 'Sanofi',
    shortageStatus: 'resolved',
    reason: 'Temporary manufacturing issue',
    estimatedResupply: '2024-01-10',
    impact: 'low',
    affectedAreas: ['California', 'Texas'],
    lastUpdated: '2024-01-10T12:00:00Z'
  },
  {
    id: 'DS-004',
    drugName: 'Tresiba (insulin degludec)',
    genericName: 'insulin degludec',
    ndc: '0169-1837-12',
    manufacturer: 'Novo Nordisk',
    shortageStatus: 'current',
    reason: 'Supply chain disruption',
    estimatedResupply: '2024-04-01',
    impact: 'high',
    affectedAreas: ['Southeast', 'Southwest'],
    lastUpdated: '2024-01-15T12:00:00Z'
  }
]

// Calculate shortage impact score for a district
export function calculateShortageImpact(
  districtState: string,
  shortages: DrugShortage[]
): {
  totalShortages: number
  currentShortages: number
  insulinShortages: number
  impactScore: number // 0-100, lower is better
  affectedProducts: string[]
} {
  // Filter current insulin shortages
  const currentInsulinShortages = shortages.filter(shortage => 
    shortage.shortageStatus === 'current' && 
    shortage.drugName.toLowerCase().includes('insulin')
  )

  // Check if district state is affected by any shortages
  const districtAffectedShortages = currentInsulinShortages.filter(shortage =>
    shortage.affectedAreas.some(area => 
      area === 'Nationwide' || 
      area.toLowerCase().includes(districtState.toLowerCase())
    )
  )

  // Calculate impact score based on number and severity of shortages
  let impactScore = 0
  
  // Base score for any insulin shortage (20 points)
  if (currentInsulinShortages.length > 0) {
    impactScore += 20
  }

  // Additional points for shortages affecting this district
  districtAffectedShortages.forEach(shortage => {
    switch (shortage.impact) {
      case 'high':
        impactScore += 30
        break
      case 'medium':
        impactScore += 20
        break
      case 'low':
        impactScore += 10
        break
    }
  })

  // Cap at 100
  impactScore = Math.min(impactScore, 100)

  return {
    totalShortages: shortages.length,
    currentShortages: shortages.filter(s => s.shortageStatus === 'current').length,
    insulinShortages: currentInsulinShortages.length,
    impactScore,
    affectedProducts: districtAffectedShortages.map(s => s.drugName)
  }
}

// Fetch drug shortage data from FDA
export async function fetchDrugShortages(): Promise<DrugShortage[]> {
  try {
    // In a real implementation, this would scrape the FDA website
    // or use their data catalog if available
    // For now, we'll use sample data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return sampleDrugShortages
  } catch (error) {
    console.error('Error fetching drug shortages:', error)
    return []
  }
}

// Get shortage impact for a specific district
export async function getDistrictShortageImpact(districtId: string): Promise<ShortageImpact | null> {
  try {
    const shortages = await fetchDrugShortages()
    const stateCode = districtId.split('-')[0]
    
    const impact = calculateShortageImpact(stateCode, shortages)
    
    return {
      districtId,
      ...impact,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting district shortage impact:', error)
    return null
  }
}

// Get all district shortage impacts
export async function getAllDistrictShortageImpacts(): Promise<ShortageImpact[]> {
  const districts = ['MA-04', 'CA-16', 'GA-07']
  const results: ShortageImpact[] = []
  
  for (const districtId of districts) {
    const impact = await getDistrictShortageImpact(districtId)
    if (impact) {
      results.push(impact)
    }
  }
  
  return results
}
