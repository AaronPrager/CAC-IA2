'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, FileText, Newspaper, Calendar, ExternalLink, Users, TrendingUp } from 'lucide-react'

export default function LegislationPage() {
  const [selectedBill, setSelectedBill] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all')

  const sampleBills = [
    {
      id: '1',
      billNumber: 'HR 1234',
      title: 'Insulin Affordability Act of 2024',
      description: 'A bill to cap insulin costs at $35 per month for all Americans',
      status: 'introduced',
      sponsor: 'Rep. Johnson (D-CA)',
      cosponsors: ['Rep. Smith (D-NY)', 'Rep. Davis (D-TX)'],
      relevantDistricts: ['CA-16', 'NY-12', 'TX-23'],
      insulinImpact: 'direct',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      billNumber: 'S 567',
      title: 'Pharmacy Access and Transparency Act',
      description: 'Improving access to pharmacies in rural and underserved areas',
      status: 'in_committee',
      sponsor: 'Sen. Brown (D-OH)',
      cosponsors: ['Sen. Warren (D-MA)', 'Sen. Sanders (I-VT)'],
      relevantDistricts: ['MA-04', 'OH-03', 'VT-AL'],
      insulinImpact: 'indirect',
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      billNumber: 'HR 890',
      title: 'Diabetes Prevention and Management Act',
      description: 'Funding for diabetes education and prevention programs',
      status: 'passed_house',
      sponsor: 'Rep. Garcia (D-IL)',
      cosponsors: ['Rep. Lee (D-CA)', 'Rep. Thompson (D-MS)'],
      relevantDistricts: ['IL-04', 'CA-16', 'MS-02'],
      insulinImpact: 'indirect',
      lastUpdated: '2024-01-08'
    }
  ]

  const samplePress = [
    {
      id: '1',
      title: 'Insulin Prices Continue to Rise Despite Federal Efforts',
      source: 'Healthcare Weekly',
      url: 'https://example.com/article1',
      publishDate: '2024-01-15',
      relevantDistricts: ['CA-16', 'NY-12'],
      summary: 'Analysis of recent insulin price trends and legislative responses',
      sentiment: 'negative'
    },
    {
      id: '2',
      title: 'New Bill Aims to Cap Insulin Costs at $35',
      source: 'Policy Today',
      url: 'https://example.com/article2',
      publishDate: '2024-01-14',
      relevantDistricts: ['CA-16', 'TX-23'],
      summary: 'Coverage of HR 1234 and its potential impact on insulin affordability',
      sentiment: 'positive'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'introduced':
        return 'bg-blue-100 text-blue-800'
      case 'in_committee':
        return 'bg-yellow-100 text-yellow-800'
      case 'passed_house':
        return 'bg-green-100 text-green-800'
      case 'passed_senate':
        return 'bg-green-100 text-green-800'
      case 'enacted':
        return 'bg-purple-100 text-purple-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      case 'neutral':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
              <Link href="/legislation" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Legislation & Press Coverage</h1>
          </div>
          <p className="text-lg text-gray-600">
            Track current bills affecting insulin access and related press coverage by district
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bills</p>
                <p className="text-2xl font-bold text-blue-600">{sampleBills.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Newspaper className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Press Articles</p>
                <p className="text-2xl font-bold text-green-600">{samplePress.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Districts Affected</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Direct Impact</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legislation Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Current Legislation</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sponsor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Districts
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.billNumber}</div>
                        <div className="text-sm text-gray-500">{bill.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                        {getStatusLabel(bill.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.sponsor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        bill.insulinImpact === 'direct' ? 'bg-red-100 text-red-800' :
                        bill.insulinImpact === 'indirect' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {bill.insulinImpact}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.relevantDistricts.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Press Coverage Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Press Coverage</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {samplePress.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-3">{article.summary}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Newspaper className="h-4 w-4 mr-1" />
                          {article.source}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.publishDate}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {article.relevantDistricts.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(article.sentiment)}`}>
                        {article.sentiment}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
