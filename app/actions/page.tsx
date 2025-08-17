'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Calendar, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function ActionsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all')

  const sampleDistricts = [
    {
      id: 'MA-04',
      name: 'Massachusetts 4th District',
      riskLevel: 'medium',
      representative: 'Jake Auchincloss',
      party: 'Democratic'
    },
    {
      id: 'CA-16',
      name: 'California 16th District',
      riskLevel: 'low',
      representative: 'Anna Eshoo',
      party: 'Democratic'
    },
    {
      id: 'GA-07',
      name: 'Georgia 7th District',
      riskLevel: 'high',
      representative: 'Lucy McBath',
      party: 'Democratic'
    }
  ]

  const sampleActions = [
    {
      districtId: 'MA-04',
      priorityActions: [
        {
          action: 'Call Representative Auchincloss',
          urgency: 'high',
          description: 'Urge support for HR 1234 (Insulin Affordability Act)',
          contactInfo: 'Phone: (202) 225-5931',
          resources: ['Script: "I support capping insulin costs at $35/month"', 'Bill details: HR 1234']
        },
        {
          action: 'Attend Town Hall Meeting',
          urgency: 'medium',
          description: 'Upcoming town hall on healthcare affordability',
          contactInfo: 'RSVP: district4@mail.house.gov',
          resources: ['Prepare questions about insulin access', 'Bring personal stories if applicable']
        }
      ],
      upcomingEvents: [
        {
          title: 'Healthcare Affordability Town Hall',
          date: '2024-01-25',
          location: 'Newton City Hall',
          description: 'Public forum on healthcare costs and access'
        }
      ]
    },
    {
      districtId: 'GA-07',
      priorityActions: [
        {
          action: 'Emergency Contact Campaign',
          urgency: 'critical',
          description: 'District has critical insulin access issues - immediate action needed',
          contactInfo: 'Phone: (202) 225-4272',
          resources: ['Urgent script about local insulin crisis', 'Request emergency meeting']
        },
        {
          action: 'Local Media Outreach',
          urgency: 'high',
          description: 'Contact local news about insulin access problems',
          contactInfo: 'Atlanta Journal-Constitution, local TV stations',
          resources: ['Press release template', 'Local statistics on diabetes rates']
        }
      ],
      upcomingEvents: [
        {
          title: 'Diabetes Support Group Meeting',
          date: '2024-01-22',
          location: 'Community Health Center',
          description: 'Monthly meeting - good opportunity to organize action'
        }
      ]
    }
  ]

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800'
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
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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
              <Link href="/legislation" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Legislation
              </Link>
              <Link href="/alerts" className="text-gray-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Alerts
              </Link>
              <Link href="/actions" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
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
            <Users className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Take Action</h1>
          </div>
          <p className="text-lg text-gray-600">
            One-page summaries of what constituents can do now to improve insulin access in their district
          </p>
        </div>

        {/* District Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your District</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => setSelectedDistrict(district.id)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedDistrict === district.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{district.id}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(district.riskLevel)}`}>
                    {district.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{district.name}</p>
                <p className="text-sm text-gray-500">{district.representative} ({district.party})</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Items */}
        {selectedDistrict !== 'all' && (
          <div className="space-y-8">
            {sampleActions
              .filter(action => action.districtId === selectedDistrict)
              .map((action) => (
                <div key={action.districtId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Action Plan for {sampleDistricts.find(d => d.id === action.districtId)?.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
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
                      {action.priorityActions.map((priorityAction, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-md font-medium text-gray-900">{priorityAction.action}</h4>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(priorityAction.urgency)}`}>
                              {getUrgencyIcon(priorityAction.urgency)}
                              <span className="ml-1">{priorityAction.urgency}</span>
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
                    {action.upcomingEvents.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                          Upcoming Events
                        </h3>
                        <div className="space-y-3">
                          {action.upcomingEvents.map((event, index) => (
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
              ))}
          </div>
        )}

        {/* General Action Tips */}
        {selectedDistrict === 'all' && (
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
    </div>
  )
}
