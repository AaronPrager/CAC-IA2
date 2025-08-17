'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Calendar, MapPin } from 'lucide-react'
import SourceBadge from '@/app/(components)/SourceBadge'

interface Alert {
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
}

interface AlertsTableProps {
  alerts: Alert[]
  onAlertClick?: (alert: Alert) => void
}

export default function AlertsTable({ alerts, onAlertClick }: AlertsTableProps) {
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'change'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const getSeverityColor = (severity: string) => {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeIcon = (changeDirection?: string) => {
    if (!changeDirection) return <Minus className="h-4 w-4 text-gray-400" />
    
    switch (changeDirection) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getChangeColor = (changeDirection?: string) => {
    if (!changeDirection) return 'text-gray-600'
    
    switch (changeDirection) {
      case 'up':
        return 'text-red-600'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const formatChange = (change?: number) => {
    if (change === undefined || change === null) return '-'
    return change > 0 ? `+${change}` : change.toString()
  }

  const formatChangePercent = (changePercent?: number) => {
    if (changePercent === undefined || changePercent === null) return '-'
    return changePercent > 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`
  }

  const handleSort = (field: 'timestamp' | 'severity' | 'change') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedAlerts = [...alerts].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'timestamp':
        aValue = new Date(a.timestamp).getTime()
        bValue = new Date(b.timestamp).getTime()
        break
      case 'severity':
        const severityOrder = { critical: 3, warning: 2, info: 1 }
        aValue = severityOrder[a.severity as keyof typeof severityOrder] || 0
        bValue = severityOrder[b.severity as keyof typeof severityOrder] || 0
        break
      case 'change':
        aValue = a.change || 0
        bValue = b.change || 0
        break
      default:
        return 0
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alert
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Time</span>
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('change')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Week-over-Week</span>
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAlerts.map((alert) => (
              <tr 
                key={alert.id} 
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  onAlertClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onAlertClick?.(alert)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {alert.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SourceBadge type={alert.source} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    {alert.districtId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTimestamp(alert.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {alert.weekOverWeek ? (
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          {getChangeIcon(alert.changeDirection)}
                          <span className={getChangeColor(alert.changeDirection)}>
                            {formatChangePercent(alert.weekOverWeek.changePercent)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {alert.weekOverWeek.previousWeek} → {alert.weekOverWeek.currentWeek}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    alert.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no alerts to display at this time.
          </p>
        </div>
      )}
    </div>
  )
}
