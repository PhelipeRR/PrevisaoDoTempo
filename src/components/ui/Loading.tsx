'use client'

import { motion } from 'framer-motion'
import { Cloud, Sun } from 'lucide-react'

interface LoadingProps {
  message?: string
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-blue-500 dark:text-blue-400"
        >
          <Sun size={48} />
        </motion.div>
        <motion.div
          animate={{ x: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 -right-2 text-gray-400 dark:text-gray-300"
        >
          <Cloud size={24} />
        </motion.div>
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-gray-600 dark:text-gray-300 text-sm"
      >
        {message}
      </motion.p>
    </div>
  )
}