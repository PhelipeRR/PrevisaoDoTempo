import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X } from 'lucide-react'
import { useSearchCities } from '@/hooks/useWeather'
import { LocationData } from '@/types/weather'
import { useTranslation } from 'react-i18next'

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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={mounted ? t('searchPlaceholder') : 'Search city...'}
          className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none transition-all text-white placeholder-white/60"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query.length > 2 || cities?.length) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {isLoading && (
              <div className="p-4 text-center text-white/70">
                {mounted ? t('loading') : 'Loading...'}
              </div>
            )}
            
            {cities && cities.length > 0 && (
              <div className="py-2">
                {cities.map((city, index) => (
                  <motion.button
                    key={`${city.lat}-${city.lon}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-white/20 transition-colors flex items-center space-x-3"
                  >
                    <MapPin className="text-white/70" size={16} />
                    <div>
                      <p className="font-medium text-white">
                        {city.name}
                      </p>
                      <p className="text-sm text-white/60">
                        {city.state && `${city.state}, `}{city.country}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
            
            {cities && cities.length === 0 && query.length > 2 && !isLoading && (
              <div className="p-4 text-center text-white/70">
                {mounted ? t('searchError') : 'City not found'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}