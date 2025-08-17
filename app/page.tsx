'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, AlertTriangle, BarChart3, Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import DistrictDrawer from '@/app/(components)/DistrictDrawer'

const Map = dynamic(() => import('@/app/(components)/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

export default function HomePage() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null)

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrictId(districtId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Insulin Access Dashboard</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Risk Map
              </Link>
              <Link href="/legislation" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Legislation
              </Link>
              <Link href="/alerts" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Alerts
              </Link>
              <Link href="/actions" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Take Action
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Map Section */}
            <div className="lg:col-span-2">
              <div className="card h-96">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Insulin Access Risk Map</h2>
                <Map onDistrictSelect={handleDistrictSelect} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Risk Overview */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">High Risk Districts</span>
                    <span className="text-lg font-semibold text-red-600">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Bills</span>
                    <span className="text-lg font-semibold text-blue-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Risk Score</span>
                    <span className="text-lg font-semibold text-orange-600">6.8</span>
                  </div>
                </div>
              </div>

              {/* Recent Legislation */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Legislation</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">HR 1234: Insulin Affordability Act</p>
                      <p className="text-xs text-gray-500">Introduced 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">S 567: Pharmacy Access Bill</p>
                      <p className="text-xs text-gray-500">In Committee 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* District Drawer */}
      <DistrictDrawer
        districtId={selectedDistrictId}
        onClose={() => setSelectedDistrictId(null)}
      />
    </div>
  )
}
