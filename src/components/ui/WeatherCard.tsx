'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface WeatherCardProps {
  title: string
  value: string
  icon: LucideIcon
  subtitle?: string
  className?: string
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </h3>
        <Icon className="text-blue-500 dark:text-blue-400" size={20} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  )
}