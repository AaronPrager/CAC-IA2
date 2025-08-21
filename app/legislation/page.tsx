'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Newspaper, TrendingUp, TrendingDown, Clock } from 'lucide-react'

interface Bill {
  id: string
  title: string
  status: 'introduced' | 'committee' | 'passed' | 'enacted' | 'failed'
  sponsor: string
  state: string
  district: string
  impact: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  lastUpdated: string
}

interface PressArticle {
  id: string
  title: string
  source: string
  state: string
  district: string
  sentiment: 'positive' | 'neutral' | 'negative'
  summary: string
  publishedDate: string
  url: string
}

export default function LegislationPage() {
  const [selectedState, setSelectedState] = useState<string>('')
  const [bills, setBills] = useState<Bill[]>([])
  const [pressArticles, setPressArticles] = useState<PressArticle[]>([])

  useEffect(() => {
    // Sample legislation data
    const sampleBills: Bill[] = [
      {
        id: 'HR-1234',
        title: 'Insulin Affordability Act of 2024',
        status: 'introduced',
        sponsor: 'Rep. Johnson (CA-16)',
        state: 'CA',
        district: 'CA-16',
        impact: 'high',
        sentiment: 'positive',
        summary: 'Bill to cap insulin copays at $35/month for all Americans',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'S-5678',
        title: 'Diabetes Prevention and Treatment Enhancement Act',
        status: 'committee',
        sponsor: 'Sen. Smith (TX)',
        state: 'TX',
        district: 'TX-01',
        impact: 'medium',
        sentiment: 'positive',
        summary: 'Expands Medicare coverage for diabetes prevention programs',
        lastUpdated: '2024-01-10'
      },
      {
        id: 'HR-9012',
        title: '340B Drug Pricing Program Reform',
        status: 'passed',
        sponsor: 'Rep. Davis (NY-12)',
        state: 'NY',
        district: 'NY-12',
        impact: 'high',
        sentiment: 'neutral',
        summary: 'Reforms the 340B program to improve access to affordable medications',
        lastUpdated: '2024-01-05'
      },
      {
        id: 'S-3456',
        title: 'State Insulin Cap Preemption Act',
        status: 'introduced',
        sponsor: 'Sen. Wilson (FL)',
        state: 'FL',
        district: 'FL-08',
        impact: 'medium',
        sentiment: 'negative',
        summary: 'Would prevent states from setting insulin price caps',
        lastUpdated: '2024-01-12'
      }
    ]

    const samplePress: PressArticle[] = [
      {
        id: 'press-1',
        title: 'California Lawmakers Push for Insulin Price Controls',
        source: 'Los Angeles Times',
        state: 'CA',
        district: 'CA-16',
        sentiment: 'positive',
        summary: 'State legislators introduce comprehensive insulin affordability measures',
        publishedDate: '2024-01-15',
        url: 'https://www.latimes.com/california-insulin-prices'
      },
      {
        id: 'press-2',
        title: 'Texas Health Centers Struggle with Insulin Access',
        source: 'Houston Chronicle',
        state: 'TX',
        district: 'TX-01',
        sentiment: 'negative',
        summary: 'Report highlights gaps in diabetes care access across rural Texas',
        publishedDate: '2024-01-14',
        url: 'https://www.houstonchronicle.com/texas-insulin-access'
      },
      {
        id: 'press-3',
        title: 'New York Expands Medicaid Diabetes Coverage',
        source: 'New York Post',
        state: 'NY',
        district: 'NY-12',
        sentiment: 'positive',
        summary: 'State announces expanded coverage for diabetes medications and supplies',
        publishedDate: '2024-01-13',
        url: 'https://nypost.com/ny-medicaid-diabetes'
      },
      {
        id: 'press-4',
        title: 'Florida Pharmacies Face Insulin Supply Challenges',
        source: 'Miami Herald',
        state: 'FL',
        district: 'FL-08',
        sentiment: 'neutral',
        summary: 'Supply chain issues affecting insulin availability in South Florida',
        publishedDate: '2024-01-12',
        url: 'https://www.miamiherald.com/florida-insulin-supply'
      }
    ]

    setBills(sampleBills)
    setPressArticles(samplePress)
  }, [])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
  }

  // Filter legislation by selected state only
  const filteredBills = selectedState 
    ? bills.filter(bill => bill.state === selectedState)
    : bills

  const filteredPress = selectedState 
    ? pressArticles.filter(article => article.state === selectedState)
    : pressArticles

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'introduced': return 'bg-blue-100 text-blue-800'
      case 'committee': return 'bg-yellow-100 text-yellow-800'
      case 'passed': return 'bg-green-100 text-green-800'
      case 'enacted': return 'bg-purple-100 text-purple-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Legislation & Press Coverage</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Risk Map
              </Link>
              <Link href="/legislation" className="text-blue-600 hover:text-blue-800 font-medium">
                Legislation
              </Link>
              <Link href="/actions" className="text-gray-500 hover:text-gray-700">
                Take Action
              </Link>
              <Link href="/alerts" className="text-gray-500 hover:text-gray-700">
                Alerts
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-700">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* State Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="text-sm text-gray-700 font-medium mb-3">Select State</div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state-select"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All States</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
                <option value="IL">Illinois</option>
                <option value="PA">Pennsylvania</option>
                <option value="OH">Ohio</option>
                <option value="GA">Georgia</option>
                <option value="NC">North Carolina</option>
                <option value="MI">Michigan</option>
                <option value="NJ">New Jersey</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="AZ">Arizona</option>
                <option value="MA">Massachusetts</option>
                <option value="TN">Tennessee</option>
                <option value="IN">Indiana</option>
                <option value="MO">Missouri</option>
                <option value="MD">Maryland</option>
                <option value="CO">Colorado</option>
                <option value="MN">Minnesota</option>
                <option value="WI">Wisconsin</option>
                <option value="LA">Louisiana</option>
                <option value="AL">Alabama</option>
                <option value="KY">Kentucky</option>
                <option value="OR">Oregon</option>
                <option value="OK">Oklahoma</option>
                <option value="CT">Connecticut</option>
                <option value="UT">Utah</option>
                <option value="IA">Iowa</option>
                <option value="NV">Nevada</option>
                <option value="AR">Arkansas</option>
                <option value="MS">Mississippi</option>
                <option value="KS">Kansas</option>
                <option value="NE">Nebraska</option>
                <option value="ID">Idaho</option>
                <option value="WV">West Virginia</option>
                <option value="HI">Hawaii</option>
                <option value="NH">New Hampshire</option>
                <option value="ME">Maine</option>
                <option value="RI">Rhode Island</option>
                <option value="MT">Montana</option>
                <option value="DE">Delaware</option>
                <option value="SD">South Dakota</option>
                <option value="ND">North Dakota</option>
                <option value="AK">Alaska</option>
                <option value="VT">Vermont</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
          </div>
          
          {selectedState && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Showing legislation for:</span> {selectedState}
              </div>
            </div>
          )}
        </div>

        {/* Filter Summary */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{filteredBills.length}</span> bills
                  {selectedState && ` in ${selectedState}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{filteredPress.length}</span> articles
                  {selectedState && ` in ${selectedState}`}
                </span>
              </div>
            </div>
            {selectedState && (
              <button
                onClick={() => {
                  setSelectedState('')
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Legislation Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-600" />
              {selectedState ? `${selectedState} Legislation` : 'Current Legislation'}
            </h2>
            
            <div className="grid gap-4">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <div key={bill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{bill.title}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(bill.impact)}`}>
                          {bill.impact.charAt(0).toUpperCase() + bill.impact.slice(1)} Impact
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Sponsor:</span> {bill.sponsor}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{bill.summary}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Last updated: {new Date(bill.lastUpdated).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        {getSentimentIcon(bill.sentiment)}
                        <span className="capitalize">{bill.sentiment}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No legislation found</p>
                  <p className="text-sm">
                    {selectedState 
                      ? `No bills found for the selected state. Try adjusting your filters.`
                      : 'No bills available at the moment.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Press Coverage Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Newspaper className="h-6 w-6 mr-3 text-green-600" />
              {selectedState ? `${selectedState} Press Coverage` : 'Press Coverage'}
            </h2>
            
            <div className="grid gap-4">
              {filteredPress.length > 0 ? (
                filteredPress.map((article) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                      <div className="flex items-center space-x-1">
                        {getSentimentIcon(article.sentiment)}
                        <span className="text-sm text-gray-600 capitalize">{article.sentiment}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Source:</span> {article.source}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{article.summary}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Published: {new Date(article.publishedDate).toLocaleDateString()}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Read Article →
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Newspaper className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No press coverage found</p>
                  <p className="text-sm">
                    {selectedState 
                      ? `No articles found for the selected state. Try adjusting your filters.`
                      : 'No press coverage available at the moment.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
