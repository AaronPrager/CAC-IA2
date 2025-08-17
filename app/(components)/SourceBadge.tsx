'use client'

interface SourceBadgeProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
}

export default function SourceBadge({ type, size = 'md' }: SourceBadgeProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'census':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'economic':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'health':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'education':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'infrastructure':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'legislation':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'press':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'census':
        return '📊'
      case 'economic':
        return '💰'
      case 'health':
        return '🏥'
      case 'education':
        return '🎓'
      case 'infrastructure':
        return '🏗️'
      case 'legislation':
        return '📋'
      case 'press':
        return '📰'
      default:
        return '📄'
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} font-medium rounded-full border ${getTypeColor(type)}`}>
      <span className="mr-1.5">{getTypeIcon(type)}</span>
      {type}
    </span>
  )
}
