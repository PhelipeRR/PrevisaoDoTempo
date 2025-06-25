import { Units } from '@/types/weather'

export const formatTemperature = (temp: number, units: Units): string => {
  const rounded = Math.round(temp)
  return units === 'metric' ? `${rounded}°C` : `${rounded}°F`
}

export const formatWindSpeed = (speed: number, units: Units): string => {
  const rounded = Math.round(speed)
  return units === 'metric' ? `${rounded} m/s` : `${rounded} mph`
}

export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`
}

export const formatVisibility = (visibility: number, units: Units): string => {
  if (units === 'metric') {
    return visibility >= 1000 ? `${(visibility / 1000).toFixed(1)} km` : `${visibility} m`
  } else {
    const miles = (visibility * 0.000621371).toFixed(1)
    return `${miles} mi`
  }
}

export const formatTime = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatDate = (timestamp: number, locale: string = 'pt-BR'): string => {
  const date = new Date(timestamp * 1000)
  const weekdays = {
    'pt-BR': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    'en-US': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'es-ES': ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  }
  const months = {
    'pt-BR': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    'en-US': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'es-ES': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  }
  
  const weekdayNames = weekdays[locale as keyof typeof weekdays] || weekdays['pt-BR']
  const monthNames = months[locale as keyof typeof months] || months['pt-BR']
  
  const weekday = weekdayNames[date.getDay()]
  const month = monthNames[date.getMonth()]
  const day = date.getDate()
  
  return `${weekday}, ${day} ${month}`
}

export const formatDateWithTranslation = (timestamp: number, t: (key: string) => string, locale: string = 'pt'): string => {
  const date = new Date(timestamp * 1000)
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  
  const weekday = t(`daysShort.${dayKeys[date.getDay()]}`)
  const month = t(`months.${monthKeys[date.getMonth()]}`)
  const day = date.getDate()
  
  return `${weekday}, ${day} ${month}`
}

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export const getUVIndexLevel = (uvIndex: number, t?: (key: string) => string): { level: string; color: string } => {
  if (uvIndex <= 2) return { level: t ? t('uvIndex.low') : 'Baixo', color: 'text-green-500' }
  if (uvIndex <= 5) return { level: t ? t('uvIndex.moderate') : 'Moderado', color: 'text-yellow-500' }
  if (uvIndex <= 7) return { level: t ? t('uvIndex.high') : 'Alto', color: 'text-orange-500' }
  if (uvIndex <= 10) return { level: t ? t('uvIndex.veryHigh') : 'Muito Alto', color: 'text-red-500' }
  return { level: t ? t('uvIndex.extreme') : 'Extremo', color: 'text-purple-500' }
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}