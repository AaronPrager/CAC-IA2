'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, FileText, AlertTriangle, Users, Phone, Mail, Download } from 'lucide-react'
import ScoreBars from '@/app/(components)/ScoreBars'
import SourceBadge from '@/app/(components)/SourceBadge'

interface DistrictDrawerProps {
  districtId: string | null
  onClose: () => void
}

interface DistrictData {
  id: string
  name: string
  state: string
  population: number
  area: number
  insulinAccessRisk: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    riskScore: number
    factors: {
      uninsuredRate: number
      diabetesPrevalence: number
      pharmacyAccess: number
      incomeLevel: number
      ruralAccess: number
    }
  }
  representative: {
    name: string
    party: string
    phone: string
    email: string
    officeAddress: string
    committeeMemberships: string[]
    insulinVotingRecord: {
      supportForInsulinBills: number
      recentVotes: Array<{
        bill: string
        vote: 'yes' | 'no' | 'abstain'
        date: string
      }>
    }
  }
  legislativeLinks: Array<{
    id: string
    title: string
    url: string
    status: string
    impact: string
  }>
  sites: Array<{
    id: string
    name: string
    url: string
    type: string
    description: string
  }>
}

export default function DistrictDrawer({ districtId, onClose }: DistrictDrawerProps) {
  const [districtData, setDistrictData] = useState<DistrictData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!districtId) {
      setDistrictData(null)
      return
    }

    const fetchDistrictData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/data/districts/${districtId}.json`)
        if (!response.ok) {
          throw new Error(`Failed to fetch district data: ${response.status}`)
        }
        
        const data = await response.json()
        setDistrictData(data)
      } catch (err) {
        console.error('Error fetching district data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch district data')
        
        // Fallback to mock data if fetch fails
        const mockData: DistrictData = {
          id: districtId,
          name: `${districtId} District`,
          state: districtId.split('-')[0],
          population: Math.floor(Math.random() * 800000) + 200000,
          area: Math.floor(Math.random() * 500) + 100,
          insulinAccessRisk: {
            riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
            riskScore: Math.floor(Math.random() * 60) + 20,
            factors: {
              uninsuredRate: Math.floor(Math.random() * 20) + 5,
              diabetesPrevalence: Math.floor(Math.random() * 15) + 8,
              pharmacyAccess: Math.floor(Math.random() * 30) + 60,
              incomeLevel: Math.floor(Math.random() * 50000) + 50000,
              ruralAccess: Math.floor(Math.random() * 40) + 20
            }
          },
          representative: {
            name: `Rep. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
            party: ['Democratic', 'Republican'][Math.floor(Math.random() * 2)],
            phone: `(202) 225-${Math.floor(Math.random() * 9000) + 1000}`,
            email: `district${districtId.split('-')[1]}@mail.house.gov`,
            officeAddress: 'Washington, DC',
            committeeMemberships: ['Armed Services', 'Transportation'],
            insulinVotingRecord: {
              supportForInsulinBills: Math.floor(Math.random() * 40) + 60,
              recentVotes: [
                {
                  bill: 'HR 1234',
                  vote: 'yes',
                  date: '2024-01-10'
                }
              ]
            }
          },
          legislativeLinks: [
            {
              id: '1',
              title: 'HR 1234: Insulin Affordability Act',
              url: 'https://congress.gov/bill/118th-congress/house-bill/1234',
              status: 'Introduced',
              impact: 'Direct'
            },
            {
              id: '2',
              title: 'S 567: Pharmacy Access Bill',
              url: 'https://congress.gov/bill/118th-congress/senate-bill/567',
              status: 'In Committee',
              impact: 'Indirect'
            },
            {
              id: '3',
              title: 'HR 890: Diabetes Prevention Act',
              url: 'https://congress.gov/bill/118th-congress/house-bill/890',
              status: 'Passed House',
              impact: 'Indirect'
            }
          ],
          sites: [
            {
              id: '1',
              name: 'Census Bureau - District Profile',
              url: 'https://data.census.gov/profile',
              type: 'census',
              description: 'Demographic and economic data for the district'
            },
            {
              id: '2',
              name: 'CDC Diabetes Atlas',
              url: 'https://gis.cdc.gov/grasp/diabetes/DiabetesAtlas.html',
              type: 'health',
              description: 'Diabetes prevalence and health indicators'
            },
            {
              id: '3',
              name: 'BLS Economic Data',
              url: 'https://www.bls.gov/eag/',
              type: 'economic',
              description: 'Employment and economic indicators'
            },
            {
              id: '4',
              name: 'HHS Health Resources',
              url: 'https://data.hrsa.gov/',
              type: 'health',
              description: 'Healthcare access and provider data'
            },
            {
              id: '5',
              name: 'USDA Rural Development',
              url: 'https://www.rd.usda.gov/',
              type: 'infrastructure',
              description: 'Rural development and infrastructure data'
            },
            {
              id: '6',
              name: 'Congress.gov District Info',
              url: 'https://www.congress.gov/members',
              type: 'legislation',
              description: 'Representative information and voting records'
            }
          ]
        }
        
        setDistrictData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchDistrictData()
  }, [districtId])

  const generatePDF = async () => {
    if (!districtData) return

    try {
      // Dynamic import of html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = document.getElementById('district-drawer-content')
      if (!element) return

      const opt = {
        margin: 1,
        filename: `${districtData.id}-insulin-access-report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  if (!districtId) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {districtData?.name || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500">
                {districtData?.state || ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={generatePDF}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Generate PDF Report"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" id="district-drawer-content">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-1">Using sample data instead.</p>
            </div>
          )}

          {districtData && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">District Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Population:</span>
                    <span className="ml-2 font-medium">{districtData.population.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <span className="ml-2 font-medium">{districtData.area} sq mi</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary-600 mr-2" />
                  Insulin Access Risk Assessment
                </h3>
                <ScoreBars 
                  scores={districtData.insulinAccessRisk.factors}
                  overallRisk={districtData.insulinAccessRisk.riskScore}
                />
              </div>

              {/* Representative Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-2" />
                  Representative Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="mb-3">
                    <p className="font-medium text-gray-900">{districtData.representative.name}</p>
                    <p className="text-sm text-gray-600">{districtData.representative.party}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{districtData.representative.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{districtData.representative.email}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Insulin Bill Support:</span>
                      <span className="text-sm font-medium text-gray-900">{districtData.representative.insulinVotingRecord.supportForInsulinBills}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full bg-primary-500" style={{ width: `${districtData.representative.insulinVotingRecord.supportForInsulinBills}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legislative Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-primary-600 mr-2" />
                  Legislative Links
                </h3>
                <div className="space-y-3">
                  {districtData.legislativeLinks.map(legislation => (
                    <div key={legislation.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <a 
                            href={legislation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {legislation.title}
                          </a>
                          <p className="text-xs text-gray-500 mt-1">Status: {legislation.status}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          legislation.impact === 'Direct' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {legislation.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sites */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                  Data Sources & Sites
                </h3>
                <div className="space-y-3">
                  {districtData.sites.map(site => (
                    <div key={site.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <a 
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            {site.name}
                          </a>
                          <p className="text-xs text-gray-600 mt-1">{site.description}</p>
                        </div>
                        <SourceBadge type={site.type} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
