'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X } from 'lucide-react'
import { useSearchCities } from '@/hooks/useWeather'
import { LocationData } from '@/types/weather'
import { useTranslation } from 'next-i18next'

interface CitySearchProps {
  onCitySelect: (city: LocationData) => void
  className?: string
}

export const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect, className = '' }) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: cities, isLoading } = useSearchCities(query)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCitySelect = (city: LocationData) => {
    onCitySelect(city)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={mounted ? t('searchPlaceholder') : 'Search for a city...'}
          className="w-full pl-10 pr-10 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            title={mounted ? t('clearSearch') : 'Clear search'}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 z-50 max-h-60 sm:max-h-80 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-xs sm:text-sm">{mounted ? t('searching') : 'Searching...'}</p>
              </div>
            ) : cities && cities.length > 0 ? (
              <div className="py-2">
                {cities.map((city, index) => (
                  <button
                    key={`${city.name}-${city.country}-${index}`}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-2 sm:space-x-3 text-gray-800"
                  >
                    <MapPin size={14} className="sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{city.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{city.state ? `${city.state}, ` : ''}{city.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-gray-600">
                <p className="text-xs sm:text-sm">{mounted ? t('cityNotFound') : 'City not found'}</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
