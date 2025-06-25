import { useQuery } from '@tanstack/react-query'
import { weatherApi } from '@/services/weatherApi'
import { Units } from '@/types/weather'

export const useCurrentWeather = (
  lat: number | null,
  lon: number | null,
  units: Units = 'metric',
  lang: string = 'pt'
) => {
  return useQuery({
    queryKey: ['weather', lat, lon, units, lang],
    queryFn: () => weatherApi.getCurrentWeather(lat!, lon!, units, lang),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useForecast = (
  lat: number | null,
  lon: number | null,
  units: Units = 'metric',
  lang: string = 'pt'
) => {
  return useQuery({
    queryKey: ['forecast', lat, lon, units, lang],
    queryFn: () => weatherApi.getForecast(lat!, lon!, units, lang),
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useSearchCities = (query: string) => {
  return useQuery({
    queryKey: ['cities', query],
    queryFn: () => weatherApi.searchCities(query),
    enabled: query.length > 2,
    staleTime: 30 * 60 * 1000,
  })
}

export const useCityByCoords = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ['city', lat, lon],
    queryFn: () => weatherApi.getCityByCoords(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 60 * 60 * 1000,
  })
}