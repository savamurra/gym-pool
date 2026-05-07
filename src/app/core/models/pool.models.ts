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
