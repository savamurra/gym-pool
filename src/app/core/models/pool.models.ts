export interface PoolService {
  id: string
  icon: string
  title: string
  description: string
  duration: string
  price: number
  order: number
}

export interface Pricing {
  id: string
  title: string
  price: number
  period: string
  features: string[]
  isPopular: boolean
  order: number
}

export interface Advantage {
  id: number
  icon: string
  title: string
  description: string
}

export interface GalleryImage {
  id: number
  image: string
  title: string
  category: string
}

export type Theme = 'dark' | 'light'

export type BookingStatus = 'processing' | 'confirmed' | 'cancelled' | 'new'

export interface Booking {
  id?: string
  name: string
  phone: string
  email: string
  service: string
  message: string
  status: BookingStatus
  createdAt: Date
}

export interface DayStats {
  date: string
  count: number
}

export interface ServiceStats {
  title: string
  count: number
  revenue: number
}

export interface StatusStats {
  new: number
  processing: number
  confirmed: number
  cancelled: number
}

export interface AnalyticsData {
  bookings: Booking[]
  services: PoolService[]
  totalBookings: number
  todayBookings: number
  conversionRate: number
  potentialRevenue: number
  byDay: DayStats[]
  byService: ServiceStats[]
  byStatus: StatusStats
}
