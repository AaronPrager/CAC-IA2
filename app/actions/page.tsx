'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Calendar, Users, AlertTriangle, CheckCircle, Clock, X, ChevronDown } from 'lucide-react'

interface District {
  id: string
  name: string
  state: string
  member: string
  metrics: {
    risk_score: number
  }
}

interface ActionItem {
  districtId: string
  priorityActions: Array<{
    action: string
    urgency: 'high' | 'medium' | 'low' | 'critical'
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
}

export default function ActionsPage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [showDistrictModal, setShowDistrictModal] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedDistrictData, setSelectedDistrictData] = useState<District | null>(null)

  // Load districts data
  useEffect(() => {
    console.log('🚀 Loading districts data for actions...')
    fetch('/data/districts.json')
      .then(response => response.json())
      .then(data => {
        console.log('✅ Districts loaded for actions:', data.districts?.length || 0)
        setDistricts(data.districts || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('❌ Error loading districts for actions:', error)
        setLoading(false)
      })
  }, [])

  // Get medium and high risk districts
  const getMediumHighRiskDistricts = () => {
    return districts.filter(d => {
      const riskScore = d.metrics?.risk_score || 0
      return riskScore > 25 // Medium (26-65) and High (66-100) risk
    }).sort((a, b) => (b.metrics?.risk_score || 0) - (a.metrics?.risk_score || 0)) // Sort by risk score (high to low)
  }

  // Sample action data - in a real app, this would come from an API
  const getActionData = (districtId: string): ActionItem => {
    const district = districts.find(d => d.id === districtId)
    const riskScore = district?.metrics?.risk_score || 0
    
    if (riskScore > 65) { // High risk
      return {
        districtId,
        priorityActions: [
          {
            action: 'Emergency Contact Campaign',
            urgency: 'critical',
            description: 'District has critical insulin access issues - immediate action needed',
            contactInfo: 'Phone: (202) 225-4272 | Email: representative@house.gov',
            resources: [
              'Urgent script about local insulin crisis',
              'Request emergency meeting with staff',
              'Local statistics on diabetes rates',
              'Personal stories from constituents'
            ]
          },
          {
            action: 'Local Media Outreach',
            urgency: 'high',
            description: 'Contact local news about insulin access problems',
            contactInfo: 'Local TV stations, newspapers, radio stations',
            resources: [
              'Press release template',
              'Local statistics on diabetes rates',
              'Contact list for media outlets',
              'Sample talking points'
            ]
          },
          {
            action: 'Community Organizing',
            urgency: 'high',
            description: 'Organize local diabetes community for collective action',
            contactInfo: 'Local diabetes support groups, health centers',
            resources: [
              'Meeting agenda template',
              'Action plan outline',
              'Resource sharing network',
              'Social media campaign materials'
            ]
          }
        ],
        upcomingEvents: [
          {
            title: 'Emergency Healthcare Access Meeting',
            date: '2024-01-25',
            location: 'Community Health Center',
            description: 'Organizing meeting to address insulin access crisis'
          },
          {
            title: 'Media Advocacy Training',
            date: '2024-01-28',
            location: 'Public Library',
            description: 'Learn how to effectively communicate with media about healthcare issues'
          }
        ]
      }
    } else { // Medium risk
      return {
        districtId,
        priorityActions: [
          {
            action: 'Call Representative',
            urgency: 'high',
            description: 'Urge support for insulin affordability legislation',
            contactInfo: 'Phone: (202) 225-4272 | Email: representative@house.gov',
            resources: [
              'Script: "I support capping insulin costs at $35/month"',
              'Bill details: HR 1234 (Insulin Affordability Act)',
              'Local impact statistics',
              'Personal story template'
            ]
          },
          {
            action: 'Attend Town Hall Meeting',
            urgency: 'medium',
            description: 'Upcoming town hall on healthcare affordability',
            contactInfo: 'RSVP: district@mail.house.gov',
            resources: [
              'Prepare questions about insulin access',
              'Bring personal stories if applicable',
              'Coordinate with other constituents',
              'Follow-up action plan'
            ]
          },
          {
            action: 'Social Media Campaign',
            urgency: 'medium',
            description: 'Raise awareness about insulin access issues',
            contactInfo: 'Twitter, Facebook, Instagram',
            resources: [
              'Hashtag campaign: #InsulinAccessNow',
              'Shareable graphics and statistics',
              'Tag local representatives and media',
              'Engage with other advocates'
            ]
          }
        ],
        upcomingEvents: [
          {
            title: 'Healthcare Affordability Town Hall',
            date: '2024-01-25',
            location: 'City Hall',
            description: 'Public forum on healthcare costs and access'
          },
          {
            title: 'Diabetes Support Group Meeting',
            date: '2024-01-22',
            location: 'Community Health Center',
            description: 'Monthly meeting - good opportunity to organize action'
          }
        ]
      }
    }
  }

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId)
    const district = districts.find(d => d.id === districtId)
    setSelectedDistrictData(district || null)
    setShowDistrictModal(false)
  }

  const getRiskLevel = (riskScore: number) => {
    if (riskScore <= 25) return 'low'
    if (riskScore <= 65) return 'medium'
    return 'high'
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading districts...</p>
        </div>
      </div>
    )
  }

  const mediumHighRiskDistricts = getMediumHighRiskDistricts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4 text-gray-500 hover:text-gray-700">
                <MapPin className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Take Action</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Risk Map
              </Link>
              <Link href="/legislation" className="text-gray-500 hover:text-gray-700">
                Legislation
              </Link>
              <Link href="/actions" className="text-blue-600 hover:text-blue-800 font-medium">
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Take Action</h1>
          </div>
          <p className="text-lg text-gray-600">
            One-page summaries of what constituents can do now to improve insulin access in their district
          </p>
        </div>

        {/* District Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Your District</h2>
              <p className="text-gray-600 mt-1">
                Choose a district to see specific action items and resources
              </p>
            </div>
            <button
              onClick={() => setShowDistrictModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Districts
            </button>
          </div>

          {selectedDistrict && selectedDistrictData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">
                    Selected: {selectedDistrictData.name} ({selectedDistrictData.id})
                  </h3>
                  <p className="text-sm text-blue-700">
                    Representative: {selectedDistrictData.member}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDistrict('')
                    setSelectedDistrictData(null)
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Change District
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Items */}
        {selectedDistrict && selectedDistrictData && (
          <div className="space-y-8">
            {(() => {
              const actionData = getActionData(selectedDistrict)
              return (
                <div key={actionData.districtId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Action Plan for {selectedDistrictData.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Risk Level: <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(getRiskLevel(selectedDistrictData.metrics?.risk_score || 0))}`}>
                        {getRiskLevel(selectedDistrictData.metrics?.risk_score || 0).toUpperCase()}
                      </span> 
                      (Score: {selectedDistrictData.metrics?.risk_score || 0}/100)
                    </p>
                    <p className="text-sm text-gray-600">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  {/* Priority Actions */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      Priority Actions
                    </h3>
                    <div className="space-y-4">
                      {actionData.priorityActions.map((priorityAction, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-md font-medium text-gray-900">{priorityAction.action}</h4>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(priorityAction.urgency)}`}>
                              {getUrgencyIcon(priorityAction.urgency)}
                              <span className="ml-1 capitalize">{priorityAction.urgency}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{priorityAction.description}</p>
                          
                          {/* Contact Information */}
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center mb-2">
                              <Phone className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-blue-900">Contact Information</span>
                            </div>
                            <p className="text-sm text-blue-800">{priorityAction.contactInfo}</p>
                          </div>

                          {/* Resources */}
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-900">Resources & Tools</span>
                            </div>
                            <ul className="text-sm text-green-800 space-y-1">
                              {priorityAction.resources.map((resource, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-green-600 mr-2">•</span>
                                  {resource}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upcoming Events */}
                    {actionData.upcomingEvents.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          Upcoming Events
                        </h3>
                        <div className="space-y-3">
                          {actionData.upcomingEvents.map((event, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {event.location}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* General Action Tips */}
        {!selectedDistrict && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Action Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Contact Your Representative</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Call their office during business hours</li>
                  <li>• Send a personalized email</li>
                  <li>• Attend town hall meetings</li>
                  <li>• Schedule an in-person meeting</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Organize Locally</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Join diabetes support groups</li>
                  <li>• Connect with healthcare advocates</li>
                  <li>• Share stories on social media</li>
                  <li>• Contact local media outlets</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* District Selection Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Select a District - Medium & High Risk Areas
              </h2>
              <button
                onClick={() => setShowDistrictModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {mediumHighRiskDistricts.length} districts with medium to high insulin access risk.
                  These areas need immediate attention and action.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediumHighRiskDistricts.map((district) => {
                  const riskLevel = getRiskLevel(district.metrics?.risk_score || 0)
                  return (
                    <button
                      key={district.id}
                      onClick={() => handleDistrictSelect(district.id)}
                      className="p-4 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{district.id}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(riskLevel)}`}>
                          {riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{district.name}</p>
                      <p className="text-sm text-gray-500 mb-2">{district.member}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Risk Score: {district.metrics?.risk_score || 0}/100
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
