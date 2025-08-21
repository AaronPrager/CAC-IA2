import { StatePolicy, PolicyImpact } from './types'

// Data sources for state policies
const POLICY_SOURCES = {
  ncsl: 'https://www.ncsl.org/health/state-insulin-copay-caps',
  ada: 'https://diabetes.org/advocacy/state-insulin-copay-caps'
}

// Sample state insulin copay cap policies
export const sampleStatePolicies: StatePolicy[] = [
  {
    state: 'MA',
    stateName: 'Massachusetts',
    insulinCopayCap: {
      amount: 25,
      currency: 'USD',
      period: 'monthly',
      effectiveDate: '2021-01-01',
      notes: 'Applies to all insulin products, regardless of type or dosage'
    },
    additionalBenefits: [
      'No prior authorization required for insulin',
      'Emergency refills allowed',
      'Patient assistance programs supported'
    ],
    coverageFriction: 'low',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    state: 'CA',
    stateName: 'California',
    insulinCopayCap: {
      amount: 30,
      currency: 'USD',
      period: 'monthly',
      effectiveDate: '2020-01-01',
      notes: 'Covers all FDA-approved insulin products'
    },
    additionalBenefits: [
      'No step therapy requirements',
      '90-day supply allowed',
      'Telemedicine coverage for diabetes management'
    ],
    coverageFriction: 'low',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    state: 'GA',
    stateName: 'Georgia',
    insulinCopayCap: {
      amount: 50,
      currency: 'USD',
      period: 'monthly',
      effectiveDate: '2022-07-01',
      notes: 'Applies to state-regulated health plans only'
    },
    additionalBenefits: [
      'Prior authorization may be required',
      'Limited to specific insulin types',
      'No emergency refill protection'
    ],
    coverageFriction: 'medium',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    state: 'TX',
    stateName: 'Texas',
    insulinCopayCap: {
      amount: 75,
      currency: 'USD',
      period: 'monthly',
      effectiveDate: '2023-01-01',
      notes: 'Limited to state employee health plans'
    },
    additionalBenefits: [
      'Step therapy may be required',
      'Prior authorization common',
      'Limited formulary coverage'
    ],
    coverageFriction: 'high',
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    state: 'NY',
    stateName: 'New York',
    insulinCopayCap: {
      amount: 0,
      currency: 'USD',
      period: 'monthly',
      effectiveDate: '2020-01-01',
      notes: 'Zero copay for all insulin products'
    },
    additionalBenefits: [
      'No prior authorization',
      'No step therapy',
      'Emergency refills guaranteed',
      'Patient education programs'
    ],
    coverageFriction: 'very_low',
    lastUpdated: '2024-01-15T12:00:00Z'
  }
]

// Calculate coverage friction score based on state policy
export function calculateCoverageFriction(stateCode: string): {
  policy: StatePolicy | null
  frictionScore: number // 0-100, lower is better
  benefits: string[]
  limitations: string[]
} {
  const policy = sampleStatePolicies.find(p => p.state === stateCode)
  
  if (!policy) {
    return {
      policy: null,
      frictionScore: 100, // No policy = highest friction
      benefits: [],
      limitations: ['No insulin copay cap policy', 'Full cost sharing applies']
    }
  }

  // Calculate friction score based on policy details
  let frictionScore = 0
  
  // Base score from copay cap amount
  if (policy.insulinCopayCap.amount === 0) {
    frictionScore = 0
  } else if (policy.insulinCopayCap.amount <= 25) {
    frictionScore = 10
  } else if (policy.insulinCopayCap.amount <= 50) {
    frictionScore = 25
  } else if (policy.insulinCopayCap.amount <= 75) {
    frictionScore = 50
  } else {
    frictionScore = 75
  }

  // Adjust based on additional benefits
  if (policy.additionalBenefits.includes('No prior authorization required for insulin')) {
    frictionScore = Math.max(0, frictionScore - 15)
  }
  if (policy.additionalBenefits.includes('No step therapy requirements')) {
    frictionScore = Math.max(0, frictionScore - 10)
  }
  if (policy.additionalBenefits.includes('Emergency refills allowed')) {
    frictionScore = Math.max(0, frictionScore - 5)
  }

  // Identify benefits and limitations
  const benefits = policy.additionalBenefits
  const limitations = []
  
  if (policy.insulinCopayCap.amount > 0) {
    limitations.push(`Copay cap: $${policy.insulinCopayCap.amount} per ${policy.insulinCopayCap.period}`)
  }
  if (policy.additionalBenefits.includes('Prior authorization may be required')) {
    limitations.push('Prior authorization may be required')
  }
  if (policy.additionalBenefits.includes('Step therapy may be required')) {
    limitations.push('Step therapy may be required')
  }

  return {
    policy,
    frictionScore: Math.min(100, Math.max(0, frictionScore)),
    benefits,
    limitations
  }
}

// Get policy impact for a specific district
export async function getDistrictPolicyImpact(districtId: string): Promise<PolicyImpact | null> {
  try {
    const stateCode = districtId.split('-')[0]
    const policyData = calculateCoverageFriction(stateCode)
    
    return {
      districtId,
      stateCode,
      stateName: policyData.policy?.stateName || 'Unknown',
      policy: policyData.policy,
      frictionScore: policyData.frictionScore,
      benefits: policyData.benefits,
      limitations: policyData.limitations,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting district policy impact:', error)
    return null
  }
}

// Get all district policy impacts
export async function getAllDistrictPolicyImpacts(): Promise<PolicyImpact[]> {
  const districts = ['MA-04', 'CA-16', 'GA-07']
  const results: PolicyImpact[] = []
  
  for (const districtId of districts) {
    const impact = await getDistrictPolicyImpact(districtId)
    if (impact) {
      results.push(impact)
    }
  }
  
  return results
}

// Get policy summary for all states
export function getPolicySummary(): {
  totalStates: number
  statesWithCaps: number
  averageCopayCap: number
  bestPolicy: StatePolicy
  worstPolicy: StatePolicy
} {
  const statesWithCaps = sampleStatePolicies.filter(p => p.insulinCopayCap.amount < 100)
  const averageCopayCap = statesWithCaps.reduce((sum, p) => sum + p.insulinCopayCap.amount, 0) / statesWithCaps.length
  
  const bestPolicy = sampleStatePolicies.reduce((best, current) => 
    current.insulinCopayCap.amount < best.insulinCopayCap.amount ? current : best
  )
  
  const worstPolicy = sampleStatePolicies.reduce((worst, current) => 
    current.insulinCopayCap.amount > worst.insulinCopayCap.amount ? current : worst
  )

  return {
    totalStates: sampleStatePolicies.length,
    statesWithCaps: statesWithCaps.length,
    averageCopayCap: Math.round(averageCopayCap),
    bestPolicy,
    worstPolicy
  }
}
