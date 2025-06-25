import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CitySearch } from '../CitySearch'
import { LocationData } from '@/types/weather'
import { vi } from 'vitest'


vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))


vi.mock('@/services/weatherApi', () => ({
  weatherApi: {
    searchCities: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('CitySearch', () => {
  const mockOnCitySelect = vi.fn()
  const mockCity: LocationData = {
    name: 'São Paulo',
    lat: -23.5505,
    lon: -46.6333,
    country: 'BR',
    state: 'SP',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    renderWithQueryClient(<CitySearch onCitySelect={mockOnCitySelect} />)
    
    expect(screen.getByPlaceholderText('searchPlaceholder')).toBeInTheDocument()
  })

  it('shows search icon', () => {
    renderWithQueryClient(<CitySearch onCitySelect={mockOnCitySelect} />)
    
    const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })

  it('updates input value when typing', () => {
    renderWithQueryClient(<CitySearch onCitySelect={mockOnCitySelect} />)
    
    const input = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'São Paulo' } })
    
    expect(input.value).toBe('São Paulo')
  })

  it('shows clear button when input has value', () => {
    renderWithQueryClient(<CitySearch onCitySelect={mockOnCitySelect} />)
    
    const input = screen.getByPlaceholderText('searchPlaceholder')
    fireEvent.change(input, { target: { value: 'São Paulo' } })
    
    const clearButton = screen.getByRole('button')
    expect(clearButton).toBeInTheDocument()
  })

  it('clears input when clear button is clicked', () => {
    renderWithQueryClient(<CitySearch onCitySelect={mockOnCitySelect} />)
    
    const input = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'São Paulo' } })
    
    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)
    
    expect(input.value).toBe('')
  })

  it('calls onCitySelect when city is selected', async () => {

    const { weatherApi } = await import('@/services/weatherApi')
    vi.mocked(weatherApi.searchCities).mockResolvedValue([mockCity])

    renderWithQueryClient(<CitySearch onCitySelect={mockOnCitySelect} />)
    
    const input = screen.getByPlaceholderText('searchPlaceholder')
    fireEvent.change(input, { target: { value: 'São Paulo' } })
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('São Paulo')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('São Paulo'))
    
    expect(mockOnCitySelect).toHaveBeenCalledWith(mockCity)
  })
})