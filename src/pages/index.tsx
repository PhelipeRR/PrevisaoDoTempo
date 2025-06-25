'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { CitySearch } from '@/components/CitySearch'
import { CurrentWeather } from '@/components/CurrentWeather'
import { WeatherForecast } from '@/components/WeatherForecast'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useCurrentWeather, useForecast, useCityByCoords } from '@/hooks/useWeather'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useSettings } from '@/contexts/SettingsContext'
import { LocationData } from '@/types/weather'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'

export default function Home() {
  const { t } = useTranslation()
  const { units, language } = useSettings()
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const {
    latitude,
    longitude,
    error: locationError,
    loading: locationLoading,
    getCurrentPosition
  } = useGeolocation()


  const currentLat = selectedLocation?.lat ?? latitude
  const currentLon = selectedLocation?.lon ?? longitude

  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather
  } = useCurrentWeather(currentLat, currentLon, units, language)

  const {
    data: forecastData,
    isLoading: forecastLoading,
    error: forecastError,
    refetch: refetchForecast
  } = useForecast(currentLat, currentLon, units, language)

  const {
    data: cityData
  } = useCityByCoords(currentLat, currentLon)

  const handleCitySelect = (city: LocationData) => {
    setSelectedLocation({ lat: city.lat, lon: city.lon })
    setSelectedCity(city.name)
  }

  const handleLocationClick = () => {
    setSelectedLocation(null)
    setSelectedCity(null)
    getCurrentPosition()
  }

  const handleRetry = () => {
    refetchWeather()
    refetchForecast()
  }

  const isLoading = locationLoading || weatherLoading || forecastLoading
  const hasError = locationError || weatherError || forecastError
  const hasData = weatherData && forecastData

  return (
    <>
      <Head>
        <title>{mounted ? t('title') : 'Weather Forecast'}</title>
        <meta name="description" content={mounted ? t('description') : 'Weather forecast application with detailed and accurate information'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☀️</text></svg>" />
      </Head>
      <div className="min-h-screen">
        <Header onLocationClick={handleLocationClick} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-16 sm:mt-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <CitySearch onCitySelect={handleCitySelect} className="max-w-md mx-auto" />
        </motion.div>


        <div className="space-y-4 sm:space-y-6">
          {isLoading && (
            <Loading message={mounted ? t('loading') : 'Loading...'} />
          )}

          {hasError && (
            <ErrorMessage
              message={locationError || weatherError?.message || forecastError?.message || (mounted ? t('error') : 'Error loading data')}
              onRetry={handleRetry}
            />
          )}

          {hasData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 sm:space-y-6"
            >
  
              <CurrentWeather
                data={weatherData}
                cityName={selectedCity || (cityData?.[0]?.name)}
              />

  
              <WeatherForecast data={forecastData} />
            </motion.div>
          )}


          {!isLoading && !hasError && !hasData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 max-w-md mx-auto text-center">
                <div className="text-5xl sm:text-6xl mb-4">🌤️</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  Bem-vindo ao {mounted ? t('title') : 'Weather Forecast'}
                </h2>
                <p className="text-sm sm:text-base text-white/80 mb-6">
                  Permita o acesso à sua localização ou busque por uma cidade para ver a previsão do tempo.
                </p>
                <button
                  onClick={getCurrentPosition}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                  title={mounted ? t('getCurrentLocationTooltip') : 'Get weather for your current location'}
                >
                  {mounted ? t('currentLocation') : 'Current Location'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'pt', ['common'])),
    },
  }
}