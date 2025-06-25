'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTranslation } from 'next-i18next'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { t } = useTranslation('common')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[200px] space-y-4 p-6"
    >
      <div className="text-red-500 dark:text-red-400">
        <AlertCircle size={48} />
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
        {message}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          title={t('retryTooltip')}
        >
          <RefreshCw size={16} />
          <span>Tentar novamente</span>
        </motion.button>
      )}
    </motion.div>
  )
}