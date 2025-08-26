import React from 'react'
import { AlertTriangleIcon, XIcon, XCircleIcon, InfoIcon } from 'lucide-react'

const AlertBanner = ({ type, message, onDismiss }) => {
  const styles = {
    warning: {
      bg: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      icon: 'text-yellow-500',
      IconComponent: AlertTriangleIcon,
    },
    critical: {
      bg: 'bg-red-50 border-red-400 text-red-800',
      icon: 'text-red-500',
      IconComponent: XCircleIcon,
    },
    info: {
      bg: 'bg-blue-50 border-blue-400 text-blue-800',
      icon: 'text-blue-500',
      IconComponent: InfoIcon,
    },
  }

  const { bg, icon, IconComponent } = styles[type] || styles.info

  return (
    <div role="alert" className={`border-l-4 p-4 mb-4 flex items-center justify-between ${bg}`}>
      <div className="flex items-center">
        <IconComponent className={`h-5 w-5 mr-2 ${icon}`} />
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss alert"
        className="text-gray-600 hover:text-gray-700 transition-colors"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

export default AlertBanner
