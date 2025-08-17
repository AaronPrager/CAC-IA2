'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, AlertTriangle, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react'
import AlertsTable from '@/app/(components)/AlertsTable'
import { fetchAlerts } from '@/lib/data'

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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const alertsData = await fetchAlerts()
      if (alertsData.success && alertsData.data) {
        setAlerts(alertsData.data)
      } else {
        throw new Error(alertsData.error || 'Failed to fetch alerts')
      }
    } catch (err) {
      console.error('Error loading alerts:', err)
      setError('Failed to load alerts. Using sample data instead.')
      
      // Fallback to sample data with week-over-week changes
      const sampleAlerts: Alert[] = [
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
        },
        {
          id: '4',
          title: 'Diabetes Prevalence Stable',
          message: 'NY-12 district diabetes rates remain unchanged',
          severity: 'info',
          source: 'health',
          districtId: 'NY-12',
          timestamp: '2024-01-12T16:45:00Z',
          status: 'resolved',
          previousValue: 9.8,
          currentValue: 9.8,
          change: 0,
          changePercent: 0,
          changeDirection: 'stable',
          weekOverWeek: {
            previousWeek: 9.8,
            currentWeek: 9.8,
            change: 0,
            changePercent: 0
          }
        },
        {
          id: '5',
          title: 'Critical Infrastructure Alert',
          message: 'TX-23 district rural access decreased by 25%',
          severity: 'critical',
          source: 'infrastructure',
          districtId: 'TX-23',
          timestamp: '2024-01-11T11:30:00Z',
          status: 'active',
          previousValue: 35,
          currentValue: 26.25,
          change: -8.75,
          changePercent: -25,
          changeDirection: 'down',
          weekOverWeek: {
            previousWeek: 35,
            currentWeek: 26.25,
            change: -8.75,
            changePercent: -25
          }
        },
        {
          id: '6',
          title: 'Economic Indicators Update',
          message: 'FL-18 district income levels increased by 5%',
          severity: 'info',
          source: 'economic',
          districtId: 'FL-18',
          timestamp: '2024-01-10T13:20:00Z',
          status: 'resolved',
          previousValue: 92000,
          currentValue: 96600,
          change: 4600,
          changePercent: 5,
          changeDirection: 'up',
          weekOverWeek: {
            previousWeek: 92000,
            currentWeek: 96600,
            change: 4600,
            changePercent: 5
          }
        }
      ]
      
      setAlerts(sampleAlerts)
    } finally {
      setLoading(false)
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.districtId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = selectedSource === 'all' || alert.source === selectedSource
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus
    
    return matchesSearch && matchesSource && matchesSeverity && matchesStatus
  })

  const getAlertStats = () => {
    const total = alerts.length
    const active = alerts.filter(a => a.status === 'active').length
    const critical = alerts.filter(a => a.severity === 'critical').length
    const increasing = alerts.filter(a => a.changeDirection === 'up').length
    const decreasing = alerts.filter(a => a.changeDirection === 'down').length

    return { total, active, critical, increasing, decreasing }
  }

  const stats = getAlertStats()

  const handleAlertClick = (alert: Alert) => {
    console.log('Alert clicked:', alert)
    // In a real app, this could open a detail view or navigate to the district
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-600 mr-3" />
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-primary-600">
                Insulin Access Dashboard
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Risk Map
              </Link>
              <Link href="/legislation" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Legislation
              </Link>
              <Link href="/actions" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Take Action
              </Link>
              <Link href="/alerts" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Alerts
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Changes</h1>
          </div>
          <p className="text-lg text-gray-600">
            Monitor week-over-week changes in insulin access risk factors across districts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Increasing</p>
                <p className="text-2xl font-bold text-red-600">{stats.increasing}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Decreasing</p>
                <p className="text-2xl font-bold text-green-600">{stats.decreasing}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div className="sm:w-32">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="census">Census</option>
                <option value="health">Health</option>
                <option value="economic">Economic</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="education">Education</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="sm:w-32">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-32">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}

        {/* Alerts Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Alerts ({filteredAlerts.length})
            </h2>
            <div className="text-sm text-gray-500">
              Showing week-over-week changes
            </div>
          </div>
          <AlertsTable alerts={filteredAlerts} onAlertClick={handleAlertClick} />
        </div>

        {/* Week-over-Week Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Week-over-Week Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Risk Factor Changes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Uninsured Rate:</span>
                  <span className="text-green-600 font-medium">↓ 2.3% avg decrease</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Diabetes Prevalence:</span>
                  <span className="text-red-600 font-medium">↑ 1.1% avg increase</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pharmacy Access:</span>
                  <span className="text-green-600 font-medium">↑ 3.2% avg increase</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Income Levels:</span>
                  <span className="text-green-600 font-medium">↑ 2.8% avg increase</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">District Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Improving:</span>
                  <span className="text-green-600 font-medium">12 districts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Declining:</span>
                  <span className="text-red-600 font-medium">8 districts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stable:</span>
                  <span className="text-gray-600 font-medium">15 districts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Alerts:</span>
                  <span className="text-blue-600 font-medium">6 this week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
