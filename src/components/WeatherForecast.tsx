'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ForecastData } from '@/types/weather'
import { formatTemperature, formatDateWithTranslation } from '@/utils/formatters'
import { useSettings } from '@/contexts/SettingsContext'
import { useTranslation } from 'react-i18next'
import { useTranslationRefresh } from '@/contexts/TranslationContext'
import { weatherApi } from '@/services/weatherApi'
import { useRouter } from 'next/router'

interface WeatherForecastProps {
  data: ForecastData
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  const { t } = useTranslation()
  const { refreshKey } = useTranslationRefresh()
  const router = useRouter()
  const { units } = useSettings()
  const [hourlyTimes, setHourlyTimes] = useState<string[]>([])
  const [dailyDates, setDailyDates] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const times = data.list.slice(0, 8).map(forecast => {
      const date = new Date(forecast.dt * 1000)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    })
    setHourlyTimes(times)
  }, [data.list])


  const dailyForecasts = data.list.filter((item, index) => {
    const date = new Date(item.dt * 1000)
    return date.getHours() >= 11 && date.getHours() <= 13
  }).slice(0, 5)

  useEffect(() => {
    if (!mounted) return
    const dates = dailyForecasts.map(forecast => 
      formatDateWithTranslation(forecast.dt, t, router.locale || 'pt')
    )
    setDailyDates(dates)
  }, [dailyForecasts, router.locale, mounted, t, refreshKey])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-100/90 to-blue-200/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-blue-300/50"
    >

      <div className="grid grid-cols-7 gap-2">
        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((dayKey, index) => {
          const forecast = dailyForecasts[index] || dailyForecasts[0]
          const isToday = index === 0
          
          return (
            <motion.div
              key={dayKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center p-3 rounded-2xl shadow-lg ${
                isToday ? 'bg-white/30 border-blue-200/30' : 'bg-white/30 border-blue-200/30'
              } backdrop-blur-sm border`}
            >
              <p className="text-xs font-semibold text-blue-800 mb-2 tracking-wider uppercase">
                {t(`daysShort.${dayKey}`)}
              </p>
              
              <div className="flex justify-center mb-2">
                <div className="bg-blue-200/90 rounded-full p-1.5 shadow-lg border border-blue-300/60">
                  <img
                    src={weatherApi.getWeatherIconUrl(forecast.weather[0].id, forecast.sys.pod === 'd')}
                    alt={(() => {
                      const description = weatherApi.getWeatherDescription(forecast.weather[0].id, t)
                      return description.startsWith('weather.') || description.startsWith('Weather.') ? 'Unknown condition' : description
                    })()}
                    className="w-10 h-10"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">
                  {formatTemperature(forecast.main.temp_max, units)}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {formatTemperature(forecast.main.temp_min, units)}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}