'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Units, Language } from '@/types/weather'
import { useRouter } from 'next/router'

interface SettingsContextType {
  units: Units
  language: Language
  setUnits: (units: Units) => void
  setLanguage: (language: Language) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: React.ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const router = useRouter()
  const [units, setUnits] = useLocalStorage<Units>('units', 'metric')
  

  const getValidLanguage = (locale: string | undefined): Language => {
    const validLanguages: Language[] = ['pt', 'en', 'es']
    return validLanguages.includes(locale as Language) ? (locale as Language) : 'pt'
  }
  
  const [storedLanguage, setStoredLanguage, isLanguageInitialized] = useLocalStorage<Language>('language', getValidLanguage(router.locale))
  

  const language = getValidLanguage(storedLanguage)
  const setLanguage = (newLanguage: Language) => {
    const validLanguage = getValidLanguage(newLanguage)
    setStoredLanguage(validLanguage)
  }


  useEffect(() => {
    if (router.locale && router.locale !== language) {
      const validLocale = getValidLanguage(router.locale)
      setLanguage(validLocale)
    }
  }, [router.locale, language, setLanguage])

  return (
    <SettingsContext.Provider value={{ units, language, setUnits, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  )
}