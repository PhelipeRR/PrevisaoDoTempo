import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { appWithTranslation } from 'next-i18next'
import '@/styles/globals.css'
import { useState } from 'react'

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
          <TranslationProvider>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </TranslationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default appWithTranslation(App)