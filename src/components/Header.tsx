'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useTranslationRefresh } from '@/contexts/TranslationContext'
import { useTranslation } from 'next-i18next'
import { Language } from '@/types/language'
import { useRouter } from 'next/router'

interface HeaderProps {
  onLocationClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onLocationClick }) => {
  const { theme, toggleTheme } = useTheme()
  const { units, language, setUnits, setLanguage } = useSettings()
  const { t } = useTranslation()
  const router = useRouter()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
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

    const newUrl = `/${newLanguage}${router.asPath === '/' ? '' : router.asPath}`
    window.location.href = newUrl
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-xl sm:text-2xl">🌤️</div>
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
              {mounted ? t('title') : 'Weather Forecast'}
            </h1>
          </div>


          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Botão de localização - sempre visível */}
            <button
              onClick={onLocationClick}
              className="flex items-center justify-center p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
              title={mounted ? t('getCurrentLocationTooltip') : 'Get weather forecast for your current location'}
            >
              <MapPin size={16} />
            </button>
            
            {/* Seletor de unidade - compacto no mobile */}
            <div className="flex bg-white/20 rounded-lg p-0.5 backdrop-blur-sm border border-white/20">
              <button
                onClick={() => setUnits('metric')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  units === 'metric'
                    ? 'bg-white/30 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                title={mounted ? t('celsiusTooltip') : 'Switch to Celsius'}
              >
                °C
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  units === 'imperial'
                    ? 'bg-white/30 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                title={mounted ? t('fahrenheitTooltip') : 'Switch to Fahrenheit'}
              >
                °F
              </button>
            </div>
            
            {/* Seletor de idioma - dropdown compacto */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center justify-center p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                title={mounted ? t('languageTooltip') : 'Select language'}
              >
                <Globe size={16} />
              </button>
              
              <AnimatePresence>
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-28 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-white/30 z-50"
                  >
                    <div className="py-1">
                      {(['pt', 'en', 'es'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            handleLanguageChange(lang)
                            setShowLanguageDropdown(false)
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 transition-colors ${
                            language === lang
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {lang === 'pt' ? 'PT' : lang === 'en' ? 'EN' : 'ES'}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Botão de tema */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
              title={mounted ? (theme === 'light' ? t('darkMode') : t('lightMode')) : 'Toggle theme'}
            >
              {!mounted ? (
                <Sun size={16} />
              ) : theme === 'light' ? (
                <Moon size={16} />
              ) : (
                <Sun size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}