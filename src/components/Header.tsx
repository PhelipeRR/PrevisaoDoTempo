'use client'

import { motion } from 'framer-motion'
import { Sun, Moon, MapPin, Globe } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSettings } from '@/contexts/SettingsContext'
import { Language } from '@/types/weather'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTranslationRefresh } from '@/contexts/TranslationContext'

interface HeaderProps {
  onLocationClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onLocationClick }) => {
  const { theme, toggleTheme } = useTheme()
  const { units, language, setUnits, setLanguage } = useSettings()
  const { t } = useTranslation()
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { refreshTranslations } = useTranslationRefresh()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = async (newLanguage: Language) => {

    const validLanguages: Language[] = ['pt', 'en', 'es']
    if (!validLanguages.includes(newLanguage)) {
      console.warn(`Invalid language: ${newLanguage}. Defaulting to 'pt'`)
      newLanguage = 'pt'
    }

    setLanguage(newLanguage)
    setShowSettings(false)


    const newUrl = `/${newLanguage}${router.asPath === '/' ? '' : router.asPath}`
    window.location.href = newUrl
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sun className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white">
              {mounted ? t('title') : 'Weather Forecast'}
            </h1>
          </div>


          <div className="flex items-center space-x-2">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLocationClick}
              className="p-2 rounded-lg bg-white/20 dark:bg-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-600/50 text-white transition-colors backdrop-blur-sm border border-white/20 dark:border-gray-600/50"
              title={mounted ? t('currentLocation') : 'Current Location'}
            >
              <MapPin size={20} />
            </motion.button>


            <div className="flex bg-white/10 dark:bg-gray-700/50 rounded-lg p-1 backdrop-blur-sm border border-white/20 dark:border-gray-600/50">
              <button
                onClick={() => setUnits('metric')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${units === 'metric'
                    ? 'bg-white/30 dark:bg-gray-600/50 text-white'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${units === 'imperial'
                    ? 'bg-white/30 dark:bg-gray-600/50 text-white'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                °F
              </button>
            </div>


            <div className="relative z-[99999]" style={{ zIndex: 99999 }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white/10 dark:bg-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-600/50 transition-colors backdrop-blur-sm border border-white/20 dark:border-gray-600/50"
              >
                <Globe size={20} className="text-white" />
              </button>

              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-32 bg-white/10 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20 dark:border-gray-600/50 z-50"
                >
                  <div className="py-1">
                    {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors ${language === lang
                            ? 'bg-white/30 dark:bg-gray-600/50 text-white'
                            : 'text-white/70'
                          }`}
                      >
                        {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>


            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 dark:bg-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-600/50 transition-colors backdrop-blur-sm border border-white/20 dark:border-gray-600/50"
            >
              {!mounted ? (
                <Sun size={20} className="text-white" />
              ) : theme === 'light' ? (
                <Moon size={20} className="text-white" />
              ) : (
                <Sun size={20} className="text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}