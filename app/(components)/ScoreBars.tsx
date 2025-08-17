'use client'

interface ScoreBarsProps {
  scores: {
    uninsuredRate: number
    diabetesPrevalence: number
    pharmacyAccess: number
    incomeLevel: number
    ruralAccess: number
  }
  overallRisk: number
}

export default function ScoreBars({ scores, overallRisk }: ScoreBarsProps) {
  const getRiskColor = (score: number) => {
    if (score <= 25) return 'bg-green-500'
    if (score <= 50) return 'bg-yellow-500'
    if (score <= 75) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getRiskLabel = (score: number) => {
    if (score <= 25) return 'Low'
    if (score <= 50) return 'Medium'
    if (score <= 75) return 'High'
    return 'Critical'
  }

  const getRiskTextColor = (score: number) => {
    if (score <= 25) return 'text-green-700'
    if (score <= 50) return 'text-yellow-700'
    if (score <= 75) return 'text-orange-700'
    return 'text-red-700'
  }

  const formatIncome = (income: number) => {
    if (income >= 1000000) return `$${(income / 1000000).toFixed(1)}M`
    if (income >= 1000) return `$${(income / 1000).toFixed(0)}K`
    return `$${income.toLocaleString()}`
  }

  const formatPercentage = (value: number) => `${value}%`

  return (
    <div className="space-y-4">
      {/* Overall Risk Score */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
          <span className={`text-lg font-bold ${getRiskTextColor(overallRisk)}`}>
            {overallRisk}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${getRiskColor(overallRisk)} transition-all duration-300`}
            style={{ width: `${overallRisk}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">Low Risk</span>
          <span className={`text-xs font-medium ${getRiskTextColor(overallRisk)}`}>
            {getRiskLabel(overallRisk)} Risk
          </span>
          <span className="text-xs text-gray-500">Critical Risk</span>
        </div>
      </div>

      {/* Individual Risk Factors */}
      <div className="space-y-3">
        {/* Uninsured Rate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Uninsured Rate</span>
            <span className="text-sm text-gray-900">{formatPercentage(scores.uninsuredRate)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getRiskColor(scores.uninsuredRate)} transition-all duration-300`}
              style={{ width: `${scores.uninsuredRate}%` }}
            />
          </div>
        </div>

        {/* Diabetes Prevalence */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Diabetes Prevalence</span>
            <span className="text-sm text-gray-900">{formatPercentage(scores.diabetesPrevalence)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getRiskColor(scores.diabetesPrevalence)} transition-all duration-300`}
              style={{ width: `${scores.diabetesPrevalence}%` }}
            />
          </div>
        </div>

        {/* Pharmacy Access (inverted - higher is better) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Pharmacy Access</span>
            <span className="text-sm text-gray-900">{formatPercentage(scores.pharmacyAccess)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getRiskColor(100 - scores.pharmacyAccess)} transition-all duration-300`}
              style={{ width: `${100 - scores.pharmacyAccess}%` }}
            />
          </div>
        </div>

        {/* Income Level (inverted - higher is better) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Average Income</span>
            <span className="text-sm text-gray-900">{formatIncome(scores.incomeLevel)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getRiskColor(Math.max(0, 100 - (scores.incomeLevel / 2000)))} transition-all duration-300`}
              style={{ width: `${Math.max(0, 100 - (scores.incomeLevel / 2000))}%` }}
            />
          </div>
        </div>

        {/* Rural Access */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Rural Population</span>
            <span className="text-sm text-gray-900">{formatPercentage(scores.ruralAccess)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getRiskColor(scores.ruralAccess)} transition-all duration-300`}
              style={{ width: `${scores.ruralAccess}%` }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="text-xs font-medium text-gray-700 mb-2">Risk Level Legend</div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <span className="text-gray-600">Low (0-25)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
            <span className="text-gray-600">Medium (26-50)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
            <span className="text-gray-600">High (51-75)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
            <span className="text-gray-600">Critical (76-100)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
