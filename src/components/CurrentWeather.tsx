import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MapPin, Thermometer, Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from 'lucide-react'
import { WeatherData } from '@/types/weather'
import { formatTemperature, formatWindSpeed, formatPressure, formatVisibility, formatTime, capitalizeFirst } from '@/utils/formatters'
import { useSettings } from '@/contexts/SettingsContext'
import { useTranslation } from 'react-i18next'
import { useTranslationRefresh } from '@/contexts/TranslationContext'
import { weatherApi } from '@/services/weatherApi'
import { useRouter } from 'next/router'

interface CurrentWeatherProps {
  data: WeatherData
  cityName?: string
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, cityName }) => {
  const { t } = useTranslation()
  const { refreshKey } = useTranslationRefresh()
  const router = useRouter()
  const { units } = useSettings()
  const [currentDate, setCurrentDate] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<string>('')
  const [sunriseTime, setSunriseTime] = useState<string>('')
  const [sunsetTime, setSunsetTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const date = new Date()
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    
    const weekday = t(`days.${dayKeys[date.getDay()]}`)
    const month = t(`months.${monthKeys[date.getMonth()]}`)
    const day = date.getDate()
    const year = date.getFullYear()
    
    const locale = router.locale || 'pt'
    
    if (locale === 'en') {
      setCurrentDate(`${weekday}, ${month} ${day}, ${year}`)
    } else {
    
      setCurrentDate(`${weekday}, ${day} de ${month} de ${year}`)
    }
  }, [router.locale, mounted, t, refreshKey])

  useEffect(() => {
    setSunriseTime(formatTime(data.sys.sunrise, data.timezone))
    setSunsetTime(formatTime(data.sys.sunset, data.timezone))
  }, [data.sys.sunrise, data.sys.sunset, data.timezone])

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateCurrentTime() // Set initial time
    const interval = setInterval(updateCurrentTime, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  const weatherCards = [
    {
      title: mounted ? t('feelsLike') : 'Feels Like',
      value: formatTemperature(data.main.feels_like, units),
      icon: Thermometer,
    },
    {
      title: mounted ? t('tempMin') : 'Min Temp',
      value: formatTemperature(data.main.temp_min, units),
      icon: Thermometer,
    },
    {
      title: mounted ? t('tempMax') : 'Max Temp',
      value: formatTemperature(data.main.temp_max, units),
      icon: Thermometer,
    },
    {
      title: mounted ? t('humidity') : 'Humidity',
      value: `${data.main.humidity}%`,
      icon: Droplets,
    },
    {
      title: mounted ? t('windSpeed') : 'Wind Speed',
      value: formatWindSpeed(data.wind.speed, units),
      icon: Wind,
    },
    {
      title: mounted ? t('pressure') : 'Pressure',
      value: formatPressure(data.main.pressure),
      icon: Gauge,
    },
    {
      title: mounted ? t('visibility') : 'Visibility',
      value: formatVisibility(data.visibility, units),
      icon: Eye,
    },
    {
      title: mounted ? t('sunrise') : 'Sunrise',
      value: sunriseTime,
      icon: Sunrise,
    },
    {
      title: mounted ? t('sunset') : 'Sunset',
      value: sunsetTime,
      icon: Sunset,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl text-center z-10"
      style={{
        background: 'linear-gradient(135deg, #4682B4 0%, #5F9EA0 25%, #6495ED 50%, #87CEEB 75%, #B0E0E6 100%)'
      }}
    >

      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-6 left-12 w-12 h-6 bg-white rounded-full opacity-40"></div>
        <div className="absolute top-8 right-16 w-20 h-10 bg-white rounded-full opacity-50"></div>
        <div className="absolute top-12 right-20 w-14 h-7 bg-white rounded-full opacity-30"></div>
        <div className="absolute bottom-16 left-6 w-18 h-9 bg-white rounded-full opacity-45"></div>
        <div className="absolute bottom-20 right-8 w-16 h-8 bg-white rounded-full opacity-35"></div>
      </div>
      

      <div className="absolute top-6 right-6 w-12 h-12 bg-yellow-300 rounded-full opacity-80 shadow-lg">
        <div className="absolute inset-1 bg-yellow-200 rounded-full"></div>
      </div>
      

      <div className="relative z-10">

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-blue-200" />
            <span className="text-lg sm:text-xl font-semibold text-white tracking-wide truncate max-w-xs sm:max-w-none">
              {cityName || data.name}
            </span>
          </div>
          <p className="text-sm sm:text-base text-blue-100 font-medium">
            {currentDate}
          </p>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 font-light">
            {currentTime}
          </p>
        </div>


        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-200/95 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-xl border-2 border-blue-300/70">
              <img
                src={weatherApi.getWeatherIconUrl(data.weather[0].id, new Date().getHours() >= 6 && new Date().getHours() < 18)}
                alt={(() => {
                  const description = weatherApi.getWeatherDescription(data.weather[0].id, t)
                  return description.startsWith('weather.') || description.startsWith('Weather.') ? 'Unknown condition' : description
                })()}
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white mb-2 tracking-tight">
            {formatTemperature(data.main.temp, units)}
          </p>
          <p className="text-lg sm:text-xl text-blue-100 capitalize font-medium tracking-wide px-2">
            {(() => {
              const description = weatherApi.getWeatherDescription(data.weather[0].id, t)
              return capitalizeFirst(description.startsWith('weather.') || description.startsWith('Weather.') ? 'Cloudy' : description)
            })()}
          </p>
        </div>


        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2 sm:p-3 text-center shadow-md">
            <p className="text-white text-xs uppercase tracking-wider mb-1 font-semibold">{mounted ? t('feelsLike') : 'Feels Like'}</p>
            <p className="text-white font-bold text-sm sm:text-base">{formatTemperature(data.main.feels_like, units)}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2 sm:p-3 text-center shadow-md">
            <p className="text-white text-xs uppercase tracking-wider mb-1 font-semibold">{mounted ? t('humidity') : 'Humidity'}</p>
            <p className="text-white font-bold text-sm sm:text-base">{data.main.humidity}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}