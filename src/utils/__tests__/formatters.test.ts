import { describe, it, expect } from 'vitest'
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatTime,
  formatDate,
  getWindDirection,
  getUVIndexLevel,
  capitalizeFirst,
} from '../formatters'

describe('formatters', () => {
  describe('formatTemperature', () => {
    it('formats temperature in Celsius', () => {
      expect(formatTemperature(25.7, 'metric')).toBe('26°C')
      expect(formatTemperature(-5.2, 'metric')).toBe('-5°C')
    })

    it('formats temperature in Fahrenheit', () => {
      expect(formatTemperature(77.5, 'imperial')).toBe('78°F')
      expect(formatTemperature(32.1, 'imperial')).toBe('32°F')
    })
  })

  describe('formatWindSpeed', () => {
    it('formats wind speed in metric units', () => {
      expect(formatWindSpeed(5.5, 'metric')).toBe('6 m/s')
      expect(formatWindSpeed(10.2, 'metric')).toBe('10 m/s')
    })

    it('formats wind speed in imperial units', () => {
      expect(formatWindSpeed(15.7, 'imperial')).toBe('16 mph')
      expect(formatWindSpeed(8.3, 'imperial')).toBe('8 mph')
    })
  })

  describe('formatPressure', () => {
    it('formats pressure in hPa', () => {
      expect(formatPressure(1013)).toBe('1013 hPa')
      expect(formatPressure(1020)).toBe('1020 hPa')
    })
  })

  describe('formatVisibility', () => {
    it('formats visibility in metric units', () => {
      expect(formatVisibility(10000, 'metric')).toBe('10.0 km')
      expect(formatVisibility(500, 'metric')).toBe('500 m')
      expect(formatVisibility(1500, 'metric')).toBe('1.5 km')
    })

    it('formats visibility in imperial units', () => {
      expect(formatVisibility(10000, 'imperial')).toBe('6.2 mi')
      expect(formatVisibility(1609, 'imperial')).toBe('1.0 mi')
    })
  })

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const timestamp = 1640995200
      const timezone = 0
      const result = formatTime(timestamp, timezone)
      expect(result).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const timestamp = 1641081600
      const result = formatDate(timestamp, 'en-US')
      expect(result).toContain('Jan')
      expect(result).toContain('1')
    })
  })

  describe('getWindDirection', () => {
    it('returns correct wind direction', () => {
      expect(getWindDirection(0)).toBe('N')
      expect(getWindDirection(90)).toBe('E')
      expect(getWindDirection(180)).toBe('S')
      expect(getWindDirection(270)).toBe('W')
      expect(getWindDirection(45)).toBe('NE')
      expect(getWindDirection(135)).toBe('SE')
      expect(getWindDirection(225)).toBe('SW')
      expect(getWindDirection(315)).toBe('NW')
    })

    it('handles edge cases', () => {
      expect(getWindDirection(360)).toBe('N')
      expect(getWindDirection(361)).toBe('N')
    })
  })

  describe('getUVIndexLevel', () => {
    it('returns correct UV index levels', () => {
      expect(getUVIndexLevel(1)).toEqual({ level: 'Baixo', color: 'text-green-500' })
      expect(getUVIndexLevel(3)).toEqual({ level: 'Moderado', color: 'text-yellow-500' })
      expect(getUVIndexLevel(6)).toEqual({ level: 'Alto', color: 'text-orange-500' })
      expect(getUVIndexLevel(8)).toEqual({ level: 'Muito Alto', color: 'text-red-500' })
      expect(getUVIndexLevel(12)).toEqual({ level: 'Extremo', color: 'text-purple-500' })
    })
  })

  describe('capitalizeFirst', () => {
    it('capitalizes first letter', () => {
      expect(capitalizeFirst('hello world')).toBe('Hello world')
      expect(capitalizeFirst('HELLO')).toBe('HELLO')
      expect(capitalizeFirst('h')).toBe('H')
      expect(capitalizeFirst('')).toBe('')
    })
  })
})