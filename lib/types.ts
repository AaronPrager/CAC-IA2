// District-related types
export interface District {
  id: string
  name: string
  state: string
  stateCode: string
  population: number
  area: number
  coordinates: [number, number]
  bounds: [[number, number], [number, number]]
  geometry: GeoJSON.Polygon
  insulinAccessRisk: InsulinAccessRisk
  representative: Representative
}

export interface InsulinAccessRisk {
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'critical'
  riskScore: number // 0-100
  factors: {
    uninsuredRate: number
    diabetesPrevalence: number
    pharmacyAccess: number
    incomeLevel: number
    ruralAccess: number
    accessProximity: number // New: Distance to health centers
    coverageFriction: number // New: Insurance barriers
    availability: number // New: Drug supply availability
    pricePressure: number // New: Cost burden
  }
  lastUpdated: string
}

export interface Representative {
  name: string
  party: 'Democratic' | 'Republican' | 'Independent'
  phone: string
  email: string
  officeAddress: string
  committeeMemberships: string[]
  insulinVotingRecord: {
    supportForInsulinBills: number // 0-100
    recentVotes: Array<{
      bill: string
      vote: 'yes' | 'no' | 'abstain'
      date: string
    }>
  }
}

export interface DistrictScore {
  districtId: string
  economic: number
  demographic: number
  education: number
  health: number
  infrastructure: number
  overall: number
  lastUpdated: string
}

// Legislation and constituent action types
export interface Legislation {
  id: string
  billNumber: string
  title: string
  description: string
  status: 'introduced' | 'in_committee' | 'passed_house' | 'passed_senate' | 'enacted' | 'failed'
  sponsor: string
  cosponsors: string[]
  relevantDistricts: string[]
  insulinImpact: 'direct' | 'indirect' | 'none'
  lastUpdated: string
}

export interface PressCoverage {
  id: string
  title: string
  source: string
  url: string
  publishDate: string
  relevantDistricts: string[]
  summary: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface ConstituentAction {
  districtId: string
  priorityActions: Array<{
    action: string
    urgency: 'high' | 'medium' | 'low'
    description: string
    contactInfo: string
    resources: string[]
  }>
  upcomingEvents: Array<{
    title: string
    date: string
    location: string
    description: string
  }>
  generatedAt: string
}

// Health Center and Service Site types
export interface HealthCenter {
  id: string
  name: string
  type: 'FQHC' | 'FQHC-Look-Alike' | 'RHC' | 'Other'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates: [number, number] // [latitude, longitude]
  }
  services: string[]
  hours: string
  phone: string
  website?: string
  lastUpdated: string
}

export interface ServiceSite {
  id: string
  healthCenterId: string
  name: string
  type: 'Primary Care' | 'Pharmacy' | 'Specialty Care' | 'Mental Health' | 'Dental'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates: [number, number]
  }
  insulinServices: {
    prescription: boolean
    dispensing: boolean
    education: boolean
    financialAssistance: boolean
  }
  hours: string
  phone: string
  lastUpdated: string
}

export interface AccessProximityData {
  districtId: string
  healthCenters: HealthCenter[]
  serviceSites: ServiceSite[]
  averageDistance: number // in miles
  nearestCenter: HealthCenter
  nearestPharmacy: ServiceSite
  coverageScore: number // 0-100
  lastUpdated: string
}

// 340B Contract Pharmacy types
export interface ContractPharmacy {
  id: string
  name: string
  type: '340B Contract Pharmacy' | 'Independent Pharmacy' | 'Chain Pharmacy'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates: [number, number]
  }
  coveredEntityId: string
  coveredEntityName: string
  services: string[]
  hours: string
  phone: string
  lastUpdated: string
}

export interface PharmacyNetwork {
  districtId: string
  contractPharmacies: ContractPharmacy[]
  totalPharmacies: number
  averageDistance: number
  networkDensityScore: number // 0-100, lower is better
  nearestPharmacy: ContractPharmacy
  lastUpdated: string
}

// Drug Shortage types
export interface DrugShortage {
  id: string
  drugName: string
  genericName: string
  ndc: string
  manufacturer: string
  shortageStatus: 'current' | 'resolved' | 'anticipated'
  reason: string
  estimatedResupply: string
  impact: 'high' | 'medium' | 'low'
  affectedAreas: string[]
  lastUpdated: string
}

export interface ShortageImpact {
  districtId: string
  totalShortages: number
  currentShortages: number
  insulinShortages: number
  impactScore: number // 0-100, lower is better
  affectedProducts: string[]
  lastUpdated: string
}

// State Policy types
export interface StatePolicy {
  state: string
  stateName: string
  insulinCopayCap: {
    amount: number
    currency: string
    period: string
    effectiveDate: string
    notes: string
  }
  additionalBenefits: string[]
  coverageFriction: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  lastUpdated: string
}

export interface PolicyImpact {
  districtId: string
  stateCode: string
  stateName: string
  policy: StatePolicy | null
  frictionScore: number // 0-100, lower is better
  benefits: string[]
  limitations: string[]
  lastUpdated: string
}

// Alert-related types
export interface Alert {
  id: string
  title: string
  message: string
  severity: 'critical' | 'warning' | 'info'
  source: string
  districtId: string
  timestamp: string
  status: 'active' | 'resolved'
  previousValue?: number
  currentValue?: number
  change?: number
  changePercent?: number
  changeDirection?: 'up' | 'down' | 'stable'
  weekOverWeek?: {
    previousWeek: number
    currentWeek: number
    change: number
    changePercent: number
  }
  metadata?: Record<string, any>
}

export interface AlertFilter {
  searchTerm: string
  source: string
  severity: string
  districtId?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Data source types
export interface DataSource {
  id: string
  name: string
  type: 'census' | 'election' | 'economic' | 'demographic' | 'education' | 'health' | 'infrastructure'
  description: string
  lastUpdated: string
  reliability: number
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Map-related types
export interface MapConfig {
  center: [number, number]
  zoom: number
  minZoom: number
  maxZoom: number
  tileLayer: string
  attribution: string
}

export interface DistrictFeature {
  type: 'Feature'
  properties: {
    id: string
    name: string
    state: string
    population: number
    score: number
  }
  geometry: GeoJSON.Polygon
}

// Component prop types
export interface MapProps {
  onDistrictSelect: (districtId: string) => void
  selectedDistrictId?: string
  showScores?: boolean
}

export interface DistrictDrawerProps {
  isOpen: boolean
  onClose: () => void
  districtId: string | null
}

export interface ScoreBarsProps {
  scores: {
    economic: number
    demographic: number
    education: number
    health: number
    infrastructure: number
  }
  showLabels?: boolean
  showValues?: boolean
}

export interface AlertsTableProps {
  searchTerm: string
  selectedSource: string
  selectedSeverity: string
  onAlertClick?: (alert: Alert) => void
}

export interface SourceBadgeProps {
  source: string
  size?: 'sm' | 'md' | 'lg'
}
