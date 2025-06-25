const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
  i18n,
  images: {
    domains: ['openweathermap.org'],
  },
}

module.exports = nextConfig