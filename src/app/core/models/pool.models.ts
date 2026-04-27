export interface PoolService {
  id: number
  icon: string
  title: string
  description: string
  duration: string
  price: number
}

export interface Pricing {
  id: number
  title: string
  price: number
  period: string
  features: string[]
  isPopular: boolean
}

export interface Advantage {
  id: number
  icon: string
  title: string
  description: string
}
