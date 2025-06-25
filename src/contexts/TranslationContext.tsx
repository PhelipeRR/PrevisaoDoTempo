import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/router'

interface TranslationContextType {
  refreshKey: number
  refreshTranslations: () => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const useTranslationRefresh = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslationRefresh must be used within a TranslationProvider')
  }
  return context
}

interface TranslationProviderProps {
  children: React.ReactNode
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  const refreshTranslations = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <TranslationContext.Provider value={{ refreshKey, refreshTranslations }}>
      {children}
    </TranslationContext.Provider>
  )
}