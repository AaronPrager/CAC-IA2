import { District, DistrictScore } from './types'

// Scoring weights for different categories
export const SCORING_WEIGHTS = {
  economic: 0.25,
  demographic: 0.20,
  education: 0.20,
  health: 0.20,
  infrastructure: 0.15
} as const

// Score thresholds
export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 0
} as const

// Economic indicators and their weights
export const ECONOMIC_INDICATORS = {
  gdpGrowth: 0.30,
  unemploymentRate: 0.25,
  medianIncome: 0.25,
  povertyRate: 0.20
} as const

// Demographic indicators
export const DEMOGRAPHIC_INDICATORS = {
  populationGrowth: 0.30,
  ageDistribution: 0.25,
  diversityIndex: 0.25,
  migrationRate: 0.20
} as const

// Education indicators
export const EDUCATION_INDICATORS = {
  graduationRate: 0.35,
  testScores: 0.30,
  teacherRatio: 0.20,
  fundingPerStudent: 0.15
} as const

// Health indicators
export const HEALTH_INDICATORS = {
  lifeExpectancy: 0.30,
  accessToCare: 0.25,
  healthOutcomes: 0.25,
  insuranceCoverage: 0.20
} as const

// Infrastructure indicators
export const INFRASTRUCTURE_INDICATORS = {
  roadQuality: 0.30,
  broadbandAccess: 0.25,
  publicTransport: 0.25,
  utilities: 0.20
} as const

export interface ScoringMetrics {
  economic: {
    gdpGrowth: number
    unemploymentRate: number
    medianIncome: number
    povertyRate: number
  }
  demographic: {
    populationGrowth: number
    ageDistribution: number
    diversityIndex: number
    migrationRate: number
  }
  education: {
    graduationRate: number
    testScores: number
    teacherRatio: number
    fundingPerStudent: number
  }
  health: {
    lifeExpectancy: number
    accessToCare: number
    healthOutcomes: number
    insuranceCoverage: number
  }
  infrastructure: {
    roadQuality: number
    broadbandAccess: number
    publicTransport: number
    utilities: number
  }
}

export interface ScoreBreakdown {
  category: string
  score: number
  weight: number
  weightedScore: number
  indicators: Record<string, number>
}

/**
 * Calculate economic score based on various indicators
 */
export function calculateEconomicScore(metrics: ScoringMetrics['economic']): number {
  const { gdpGrowth, unemploymentRate, medianIncome, povertyRate } = metrics
  
  // Normalize values to 0-100 scale
  const normalizedGdpGrowth = Math.min(Math.max(gdpGrowth, -5), 10) // -5% to 10%
  const normalizedUnemployment = Math.min(Math.max(unemploymentRate, 2), 15) // 2% to 15%
  const normalizedIncome = Math.min(Math.max(medianIncome, 30000), 100000) // $30k to $100k
  const normalizedPoverty = Math.min(Math.max(povertyRate, 5), 25) // 5% to 25%
  
  // Calculate individual scores (higher is better, except unemployment and poverty)
  const gdpScore = ((normalizedGdpGrowth + 5) / 15) * 100
  const unemploymentScore = ((15 - normalizedUnemployment) / 13) * 100
  const incomeScore = ((normalizedIncome - 30000) / 70000) * 100
  const povertyScore = ((25 - normalizedPoverty) / 20) * 100
  
  // Apply weights
  const weightedScore = 
    gdpScore * ECONOMIC_INDICATORS.gdpGrowth +
    unemploymentScore * ECONOMIC_INDICATORS.unemploymentRate +
    incomeScore * ECONOMIC_INDICATORS.medianIncome +
    povertyScore * ECONOMIC_INDICATORS.povertyRate
  
  return Math.round(weightedScore)
}

/**
 * Calculate demographic score
 */
export function calculateDemographicScore(metrics: ScoringMetrics['demographic']): number {
  const { populationGrowth, ageDistribution, diversityIndex, migrationRate } = metrics
  
  // Normalize values
  const normalizedGrowth = Math.min(Math.max(populationGrowth, -2), 5) // -2% to 5%
  const normalizedAge = Math.min(Math.max(ageDistribution, 0.1), 0.3) // 10% to 30% seniors
  const normalizedDiversity = Math.min(Math.max(diversityIndex, 0.1), 0.8) // 10% to 80%
  const normalizedMigration = Math.min(Math.max(migrationRate, -3), 3) // -3% to 3%
  
  // Calculate scores
  const growthScore = ((normalizedGrowth + 2) / 7) * 100
  const ageScore = ((0.3 - normalizedAge) / 0.2) * 100 // Lower senior % is better
  const diversityScore = normalizedDiversity * 100
  const migrationScore = ((normalizedMigration + 3) / 6) * 100
  
  const weightedScore = 
    growthScore * DEMOGRAPHIC_INDICATORS.populationGrowth +
    ageScore * DEMOGRAPHIC_INDICATORS.ageDistribution +
    diversityScore * DEMOGRAPHIC_INDICATORS.diversityIndex +
    migrationScore * DEMOGRAPHIC_INDICATORS.migrationRate
  
  return Math.round(weightedScore)
}

/**
 * Calculate education score
 */
export function calculateEducationScore(metrics: ScoringMetrics['education']): number {
  const { graduationRate, testScores, teacherRatio, fundingPerStudent } = metrics
  
  // Normalize values
  const normalizedGraduation = Math.min(Math.max(graduationRate, 60), 95) // 60% to 95%
  const normalizedTestScores = Math.min(Math.max(testScores, 60), 90) // 60 to 90 percentile
  const normalizedTeacherRatio = Math.min(Math.max(teacherRatio, 15), 25) // 15:1 to 25:1
  const normalizedFunding = Math.min(Math.max(fundingPerStudent, 8000), 20000) // $8k to $20k
  
  // Calculate scores
  const graduationScore = ((normalizedGraduation - 60) / 35) * 100
  const testScore = ((normalizedTestScores - 60) / 30) * 100
  const teacherScore = ((25 - normalizedTeacherRatio) / 10) * 100 // Lower ratio is better
  const fundingScore = ((normalizedFunding - 8000) / 12000) * 100
  
  const weightedScore = 
    graduationScore * EDUCATION_INDICATORS.graduationRate +
    testScore * EDUCATION_INDICATORS.testScores +
    teacherScore * EDUCATION_INDICATORS.teacherRatio +
    fundingScore * EDUCATION_INDICATORS.fundingPerStudent
  
  return Math.round(weightedScore)
}

/**
 * Calculate health score
 */
export function calculateHealthScore(metrics: ScoringMetrics['health']): number {
  const { lifeExpectancy, accessToCare, healthOutcomes, insuranceCoverage } = metrics
  
  // Normalize values
  const normalizedLifeExpectancy = Math.min(Math.max(lifeExpectancy, 70), 85) // 70 to 85 years
  const normalizedAccess = Math.min(Math.max(accessToCare, 0.6), 0.95) // 60% to 95%
  const normalizedOutcomes = Math.min(Math.max(healthOutcomes, 0.5), 0.9) // 50% to 90%
  const normalizedInsurance = Math.min(Math.max(insuranceCoverage, 0.7), 0.98) // 70% to 98%
  
  // Calculate scores
  const lifeScore = ((normalizedLifeExpectancy - 70) / 15) * 100
  const accessScore = ((normalizedAccess - 0.6) / 0.35) * 100
  const outcomesScore = ((normalizedOutcomes - 0.5) / 0.4) * 100
  const insuranceScore = ((normalizedInsurance - 0.7) / 0.28) * 100
  
  const weightedScore = 
    lifeScore * HEALTH_INDICATORS.lifeExpectancy +
    accessScore * HEALTH_INDICATORS.accessToCare +
    outcomesScore * HEALTH_INDICATORS.healthOutcomes +
    insuranceScore * HEALTH_INDICATORS.insuranceCoverage
  
  return Math.round(weightedScore)
}

/**
 * Calculate infrastructure score
 */
export function calculateInfrastructureScore(metrics: ScoringMetrics['infrastructure']): number {
  const { roadQuality, broadbandAccess, publicTransport, utilities } = metrics
  
  // Normalize values
  const normalizedRoadQuality = Math.min(Math.max(roadQuality, 0.3), 0.95) // 30% to 95%
  const normalizedBroadband = Math.min(Math.max(broadbandAccess, 0.5), 0.98) // 50% to 98%
  const normalizedTransport = Math.min(Math.max(publicTransport, 0.2), 0.9) // 20% to 90%
  const normalizedUtilities = Math.min(Math.max(utilities, 0.7), 0.99) // 70% to 99%
  
  // Calculate scores
  const roadScore = ((normalizedRoadQuality - 0.3) / 0.65) * 100
  const broadbandScore = ((normalizedBroadband - 0.5) / 0.48) * 100
  const transportScore = ((normalizedTransport - 0.2) / 0.7) * 100
  const utilitiesScore = ((normalizedUtilities - 0.7) / 0.29) * 100
  
  const weightedScore = 
    roadScore * INFRASTRUCTURE_INDICATORS.roadQuality +
    broadbandScore * INFRASTRUCTURE_INDICATORS.broadbandAccess +
    transportScore * INFRASTRUCTURE_INDICATORS.publicTransport +
    utilitiesScore * INFRASTRUCTURE_INDICATORS.utilities
  
  return Math.round(weightedScore)
}

/**
 * Calculate overall district score
 */
export function calculateOverallScore(scores: {
  economic: number
  demographic: number
  education: number
  health: number
  infrastructure: number
}): number {
  const weightedScore = 
    scores.economic * SCORING_WEIGHTS.economic +
    scores.demographic * SCORING_WEIGHTS.demographic +
    scores.education * SCORING_WEIGHTS.education +
    scores.health * SCORING_WEIGHTS.health +
    scores.infrastructure * SCORING_WEIGHTS.infrastructure
  
  return Math.round(weightedScore)
}

/**
 * Get score category label
 */
export function getScoreCategory(score: number): string {
  if (score >= SCORE_THRESHOLDS.excellent) return 'Excellent'
  if (score >= SCORE_THRESHOLDS.good) return 'Good'
  if (score >= SCORE_THRESHOLDS.fair) return 'Fair'
  return 'Poor'
}

/**
 * Get score color class
 */
export function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.excellent) return 'text-green-600 bg-green-100'
  if (score >= SCORE_THRESHOLDS.good) return 'text-blue-600 bg-blue-100'
  if (score >= SCORE_THRESHOLDS.fair) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

/**
 * Generate complete score breakdown
 */
export function generateScoreBreakdown(metrics: ScoringMetrics): ScoreBreakdown[] {
  const economicScore = calculateEconomicScore(metrics.economic)
  const demographicScore = calculateDemographicScore(metrics.demographic)
  const educationScore = calculateEducationScore(metrics.education)
  const healthScore = calculateHealthScore(metrics.health)
  const infrastructureScore = calculateInfrastructureScore(metrics.infrastructure)
  
  return [
    {
      category: 'Economic',
      score: economicScore,
      weight: SCORING_WEIGHTS.economic,
      weightedScore: economicScore * SCORING_WEIGHTS.economic,
      indicators: metrics.economic
    },
    {
      category: 'Demographic',
      score: demographicScore,
      weight: SCORING_WEIGHTS.demographic,
      weightedScore: demographicScore * SCORING_WEIGHTS.demographic,
      indicators: metrics.demographic
    },
    {
      category: 'Education',
      score: educationScore,
      weight: SCORING_WEIGHTS.education,
      weightedScore: educationScore * SCORING_WEIGHTS.education,
      indicators: metrics.education
    },
    {
      category: 'Health',
      score: healthScore,
      weight: SCORING_WEIGHTS.health,
      weightedScore: healthScore * SCORING_WEIGHTS.health,
      indicators: metrics.health
    },
    {
      category: 'Infrastructure',
      score: infrastructureScore,
      weight: SCORING_WEIGHTS.infrastructure,
      weightedScore: infrastructureScore * SCORING_WEIGHTS.infrastructure,
      indicators: metrics.infrastructure
    }
  ]
}
