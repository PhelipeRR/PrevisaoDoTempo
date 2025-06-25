import { WeatherData, ForecastData, LocationData, Units } from '@/types/weather'

const BASE_URL = 'https://api.open-meteo.com/v1'
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'


export const weatherApi = {
  async getCurrentWeather(lat: number, lon: number, units: Units = 'metric', lang: string = 'pt'): Promise<WeatherData> {
    const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit'
    const windUnit = units === 'metric' ? 'kmh' : 'mph'
    
    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=mm&timezone=auto&forecast_days=1`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    const data = await response.json()
    return this.transformCurrentWeatherData(data, lat, lon)
  },

  async getForecast(lat: number, lon: number, units: Units = 'metric', lang: string = 'pt'): Promise<ForecastData> {
    const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit'
    const windUnit = units === 'metric' ? 'kmh' : 'mph'
    
    const response = await fetch(
      `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=mm&timezone=auto&forecast_days=5`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data')
    }
    
    const data = await response.json()
    return this.transformForecastData(data, lat, lon)
  },

  async searchCities(query: string, limit: number = 5): Promise<LocationData[]> {
    const response = await fetch(
      `${GEO_URL}/search?name=${encodeURIComponent(query)}&count=${limit}&language=pt&format=json`
    )
    
    if (!response.ok) {
      throw new Error('Failed to search cities')
    }
    
    const data = await response.json()
    return this.transformLocationData(data.results || [])
  },

  async getCityByCoords(lat: number, lon: number): Promise<LocationData[]> {
  
    const url = `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt&addressdetails=1`
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'WeatherApp/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to get city by coordinates')
      }
      
      const data = await response.json()
      
      if (!data || !data.address) {
        return []
      }
      
    
      const address = data.address
      const cityName = address.city || address.town || address.village || address.municipality || address.county || 'Localização Atual'
      
      return [{
        name: cityName,
        local_names: {},
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        country: address.country || '',
        state: address.state || ''
      }]
    } catch (error) {
      console.error('Error fetching city data:', error)
      throw error
    }
  },

  getWeatherIconUrl(weatherCode: number, isDay: boolean = true): string {
    
    const iconMap: Record<number, { day: string; night: string }> = {
      0: { day: '01d', night: '01n' },
      1: { day: '02d', night: '02n' },
      2: { day: '03d', night: '03n' },
      3: { day: '04d', night: '04n' },
      45: { day: '50d', night: '50n' },
      48: { day: '50d', night: '50n' },
      51: { day: '09d', night: '09n' },
      53: { day: '09d', night: '09n' },
      55: { day: '10d', night: '10n' },
      56: { day: '09d', night: '09n' },
      57: { day: '10d', night: '10n' },
      61: { day: '10d', night: '10n' },
      63: { day: '10d', night: '10n' },
      65: { day: '10d', night: '10n' },
      66: { day: '10d', night: '10n' },
      67: { day: '10d', night: '10n' },
      71: { day: '13d', night: '13n' },
      73: { day: '13d', night: '13n' },
      75: { day: '13d', night: '13n' },
      77: { day: '13d', night: '13n' },
      80: { day: '09d', night: '09n' },
      81: { day: '09d', night: '09n' },
      82: { day: '09d', night: '09n' },
      85: { day: '13d', night: '13n' },
      86: { day: '13d', night: '13n' },
      95: { day: '11d', night: '11n' },
      96: { day: '11d', night: '11n' },
      99: { day: '11d', night: '11n' }
    }
    
    const iconCode = iconMap[weatherCode] || { day: '01d', night: '01n' }
    const icon = isDay ? iconCode.day : iconCode.night
    
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
  },

  transformLocationData(results: any[]): LocationData[] {
    return results.map((item: any) => ({
      name: item.name,
      lat: item.latitude,
      lon: item.longitude,
      country: item.country_code?.toUpperCase() || item.country || '',
      state: item.admin1 || undefined,
      local_names: item.name ? { pt: item.name } : undefined
    }))
  },

  transformCurrentWeatherData(data: any, lat: number, lon: number): WeatherData {
    const current = data.current
    const daily = data.daily
    const weatherCode = current.weather_code || 0
    const isDay = current.is_day === 1
    
    return {
      coord: { lat, lon },
      weather: [{
        id: weatherCode,
        main: weatherCode.toString(),
        description: weatherCode.toString(),
        icon: this.getWeatherIcon(weatherCode, isDay)
      }],
      base: 'stations',
      main: {
        temp: current.temperature_2m || 0,
        feels_like: current.apparent_temperature || current.temperature_2m || 0,
        temp_min: daily.temperature_2m_min?.[0] || current.temperature_2m || 0,
        temp_max: daily.temperature_2m_max?.[0] || current.temperature_2m || 0,
        pressure: current.pressure_msl || current.surface_pressure || 1013,
        humidity: current.relative_humidity_2m || 0,
        sea_level: current.pressure_msl || 1013,
        grnd_level: current.surface_pressure || 1013
      },
      visibility: 10000,
      wind: {
        speed: current.wind_speed_10m || 0,
        deg: current.wind_direction_10m || 0,
        gust: current.wind_gusts_10m || undefined
      },
      clouds: {
        all: current.cloud_cover || 0
      },
      dt: Math.floor(new Date(current.time).getTime() / 1000),
      sys: {
        country: 'BR',
        sunrise: Math.floor(new Date(daily.sunrise?.[0]).getTime() / 1000),
        sunset: Math.floor(new Date(daily.sunset?.[0]).getTime() / 1000)
      },
      timezone: 0,
      id: 0,
      name: '',
      cod: 200
    }
  },

  transformForecastData(data: any, lat: number, lon: number): ForecastData {
    const hourly = data.hourly
    const daily = data.daily
    
    const list = hourly.time.map((time: string, index: number) => {
      const weatherCode = hourly.weather_code[index] || 0
      const isDay = hourly.is_day[index] === 1
      const currentDate = new Date(time)
      const dayIndex = Math.floor(index / 24)
      
      return {
        dt: Math.floor(new Date(time).getTime() / 1000),
        main: {
          temp: hourly.temperature_2m[index] || 0,
          feels_like: hourly.apparent_temperature[index] || hourly.temperature_2m[index] || 0,
          temp_min: daily.temperature_2m_min?.[dayIndex] || hourly.temperature_2m[index] || 0,
          temp_max: daily.temperature_2m_max?.[dayIndex] || hourly.temperature_2m[index] || 0,
          pressure: hourly.pressure_msl[index] || hourly.surface_pressure[index] || 1013,
          sea_level: hourly.pressure_msl[index] || 1013,
          grnd_level: hourly.surface_pressure[index] || 1013,
          humidity: hourly.relative_humidity_2m[index] || 0,
          temp_kf: 0
        },
        weather: [{
          id: weatherCode,
          main: weatherCode.toString(),
          description: weatherCode.toString(),
          icon: this.getWeatherIcon(weatherCode, isDay)
        }],
        clouds: {
          all: hourly.cloud_cover[index] || 0
        },
        wind: {
          speed: hourly.wind_speed_10m[index] || 0,
          deg: hourly.wind_direction_10m[index] || 0,
          gust: hourly.wind_gusts_10m[index] || undefined
        },
        visibility: 10000,
        pop: (hourly.precipitation_probability[index] || 0) / 100,
        rain: hourly.rain[index] ? { '3h': hourly.rain[index] } : undefined,
        snow: hourly.snowfall[index] ? { '3h': hourly.snowfall[index] } : undefined,
        sys: { pod: isDay ? 'd' : 'n' },
        dt_txt: time
      }
    })
    
    return {
      cod: '200',
      message: 0,
      cnt: list.length,
      list,
      city: {
        id: 0,
        name: '',
        coord: { lat, lon },
        country: 'BR',
        population: 0,
        timezone: 0,
        sunrise: Math.floor(new Date(daily.sunrise?.[0]).getTime() / 1000),
        sunset: Math.floor(new Date(daily.sunset?.[0]).getTime() / 1000)
      }
    }
  },

  getWeatherDescription(weatherCode: number | string, t?: any): string {
    if (t) {
  
      const numericCode = typeof weatherCode === 'string' ? parseInt(weatherCode, 10) : weatherCode
      
  
      if (isNaN(numericCode)) {
        return t('weather.unknown') !== 'weather.unknown' ? t('weather.unknown') : 'Unknown condition'
      }
      
      const translationKey = `weather.${numericCode}`
      const translation = t(translationKey)
      
      if (translation !== translationKey) {
        return translation
      }
      
  
      const unknownTranslation = t('weather.unknown')
      
  
      return unknownTranslation !== 'weather.unknown' ? unknownTranslation : 'Unknown condition'
    }
    
  
  
    const numericCode = typeof weatherCode === 'string' ? parseInt(weatherCode, 10) : weatherCode
    
  
    if (isNaN(numericCode)) {
      return 'Condição desconhecida'
    }
    
    const descriptions: Record<number, string> = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Neblina com geada',
      51: 'Garoa leve',
      53: 'Garoa moderada',
      55: 'Garoa intensa',
      56: 'Garoa congelante leve',
      57: 'Garoa congelante intensa',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      66: 'Chuva congelante leve',
      67: 'Chuva congelante forte',
      71: 'Neve leve',
      73: 'Neve moderada',
      75: 'Neve forte',
      77: 'Granizo',
      80: 'Pancadas de chuva leves',
      81: 'Pancadas de chuva moderadas',
      82: 'Pancadas de chuva fortes',
      85: 'Pancadas de neve leves',
      86: 'Pancadas de neve moderadas',
      95: 'Tempestade',
      96: 'Tempestade com granizo leve',
      99: 'Tempestade com granizo forte'
    }
    return descriptions[numericCode] || 'Condição desconhecida'
  },

  getWeatherIcon(weatherCode: number, isDay: boolean): string {
    const iconMap: Record<number, { day: string; night: string }> = {
      0: { day: '01d', night: '01n' },
      1: { day: '02d', night: '02n' },
      2: { day: '03d', night: '03n' },
      3: { day: '04d', night: '04n' },
      45: { day: '50d', night: '50n' },
      48: { day: '50d', night: '50n' },
      51: { day: '09d', night: '09n' },
      53: { day: '09d', night: '09n' },
      55: { day: '09d', night: '09n' },
      56: { day: '09d', night: '09n' },
      57: { day: '09d', night: '09n' },
      61: { day: '10d', night: '10n' },
      63: { day: '10d', night: '10n' },
      65: { day: '10d', night: '10n' },
      66: { day: '10d', night: '10n' },
      67: { day: '10d', night: '10n' },
      71: { day: '13d', night: '13n' },
      73: { day: '13d', night: '13n' },
      75: { day: '13d', night: '13n' },
      77: { day: '13d', night: '13n' },
      80: { day: '09d', night: '09n' },
      81: { day: '09d', night: '09n' },
      82: { day: '09d', night: '09n' },
      85: { day: '13d', night: '13n' },
      86: { day: '13d', night: '13n' },
      95: { day: '11d', night: '11n' },
      96: { day: '11d', night: '11n' },
      99: { day: '11d', night: '11n' }
    }
    
    const iconCode = iconMap[weatherCode] || { day: '01d', night: '01n' }
    return isDay ? iconCode.day : iconCode.night
  }
}