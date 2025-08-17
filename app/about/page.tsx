import Link from 'next/link'
import { MapPin, FileText, Users, Code, Database } from 'lucide-react'

export default function AboutPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About the Insulin Access Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A nonpartisan MVP dashboard for mapping insulin access risk, tracking legislation, and generating constituent action plans
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Mapping</h3>
            <p className="text-gray-600">Visualize insulin access risk by congressional district</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Legislation Tracking</h3>
            <p className="text-gray-600">Monitor current bills and press coverage affecting insulin access</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Constituent Action</h3>
            <p className="text-gray-600">Generate one-page summaries of what constituents can do now</p>
          </div>
        </div>

        {/* Data & Methodology */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data & Methodology</h2>
          
          {/* Transparency Statement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Transparency & Nonpartisan Approach</h3>
            <p className="text-blue-800 mb-3">
              This dashboard is designed as a <strong>nonpartisan MVP (Minimum Viable Product)</strong> to demonstrate the potential for 
              data-driven insights into insulin access challenges across congressional districts.
            </p>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• <strong>No PHI (Protected Health Information)</strong> is collected or displayed</li>
              <li>• <strong>Static, partly hand-curated demo data</strong> for demonstration purposes</li>
              <li>• <strong>Transparent methodology</strong> with open-source risk calculation formulas</li>
              <li>• <strong>Educational tool</strong> for understanding healthcare access challenges</li>
            </ul>
          </div>

          {/* Risk Formula */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Calculation Formula</h3>
            <p className="text-gray-700 mb-4">
              The insulin access risk score is calculated using a weighted formula that considers multiple factors:
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-600 mb-2">risk_score = 0.4 × access_proximity + 0.3 × coverage_friction + 0.2 × availability + 0.1 × price_pressure</div>
              <div className="text-xs text-gray-500 mt-2">
                Where each factor is normalized to a 0-100 scale
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Factor Weights:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Access Proximity (40%)</strong>: Distance to pharmacies, healthcare facilities</li>
                  <li>• <strong>Coverage Friction (30%)</strong>: Insurance barriers, prior authorization requirements</li>
                  <li>• <strong>Availability (20%)</strong>: Drug shortages, supply chain issues</li>
                  <li>• <strong>Price Pressure (10%)</strong>: Cost burden, out-of-pocket expenses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Risk Levels:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <span className="text-green-600 font-medium">Low (0-25)</span>: Minimal access barriers</li>
                  <li>• <span className="text-yellow-600 font-medium">Medium (26-50)</span>: Moderate challenges</li>
                  <li>• <span className="text-orange-600 font-medium">High (51-75)</span>: Significant barriers</li>
                  <li>• <span className="text-red-600 font-medium">Critical (76-100)</span>: Severe access issues</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Sources & Limitations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Data Sources:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Demo Data</strong>: Hand-curated sample data for 6 congressional districts</li>
                  <li>• <strong>Risk Factors</strong>: Simulated metrics based on typical healthcare access patterns</li>
                  <li>• <strong>Legislation</strong>: Sample bills and press coverage for demonstration</li>
                  <li>• <strong>Representative Info</strong>: Public contact information and voting records</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Limitations & Future Development:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Not Real-Time</strong>: Data is static and updated manually</li>
                  <li>• <strong>Limited Coverage</strong>: Currently covers 6 sample districts</li>
                  <li>• <strong>Simulated Metrics</strong>: Risk scores are calculated from demo data</li>
                  <li>• <strong>Educational Purpose</strong>: Designed for demonstration and learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Code className="h-5 w-5 mr-2 text-primary-600" />
                Technology Stack
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 14 with App Router</li>
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Leaflet for interactive maps</li>
                <li>• Lucide React for icons</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary-600" />
                Data Sources
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• District boundary GeoJSON files</li>
                <li>• Demo risk metrics and analytics</li>
                <li>• Week-over-week change tracking</li>
                <li>• Sample legislation and press data</li>
                <li>• Transparent methodology documentation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* About Aaron */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary-600" />
            About Aaron
          </h2>
          
          {/* Aaron's Personal Info */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary-300">
                <img 
                  src="/aaron-prager.jpg" 
                  alt="Aaron Prager" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Personal Details */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Aaron Prager</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium w-24">Education:</span>
                  <span>Rising Junior at British International School of Boston</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Email:</span>
                  <a href="mailto:arik@pragersfamily.com" className="text-primary-600 hover:text-primary-700 underline">
                    arik@pragersfamily.com
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Location:</span>
                  <span>Boston, Massachusetts</span>
                </div>
              </div>
              
              <p className="mt-4 text-gray-700">
                Aaron is a passionate student developer who created this MVP dashboard as a demonstration project 
                to showcase how data-driven insights can be used to understand insulin access challenges across 
                congressional districts. The project serves as a foundation for future development and real-world implementation.
              </p>
            </div>
          </div>
          
          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Project Vision</h4>
              <p className="text-sm text-gray-600">Creating transparent, data-driven tools for healthcare policy analysis</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Technical Approach</h4>
              <p className="text-sm text-gray-600">Full-stack development with focus on user experience and data transparency</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Methodology</h4>
              <p className="text-sm text-gray-600">Open-source risk calculation formulas and transparent data processing</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Future Goals</h4>
              <p className="text-sm text-gray-600">Expanding coverage and implementing real-time data integration</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have questions or suggestions? We'd love to hear from you.
          </p>
          <Link href="/" className="btn-primary">
            Back to Map
          </Link>
        </div>
      </main>
    </div>
  )
}
