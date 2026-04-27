import { Injectable, signal } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class PoolDataService {
  private servicesData = signal<PoolService[]>([
    {
      id: 1,
      icon: '🏊',
      title: 'Спортивное плавание',
      description: 'Тренировки с профессиональным тренером для улучшения техники и скорости плавания',
      duration: '60 мин',
      price: 1500
    },
    {
      id: 2,
      icon: '💪',
      title: 'Аквафитнес',
      description: 'Групповые тренировки в воде для укрепления мышц и похудения без нагрузки на суставы',
      duration: '45 мин',
      price: 1200
    },
    {
      id: 3,
      icon: '🧘',
      title: 'Аквайога',
      description: 'Расслабляющие практики в воде для улучшения гибкости и снятия стресса',
      duration: '60 мин',
      price: 1300
    },
    {
      id: 4,
      icon: '👶',
      title: 'Детское плавание',
      description: 'Обучение детей плаванию с нуля в безопасной и комфортной атмосфере',
      duration: '45 мин',
      price: 1400
    },
    {
      id: 5,
      icon: '🤽',
      title: 'Водное поло',
      description: 'Командная игра в воде для развития выносливости и командного духа',
      duration: '90 мин',
      price: 1800
    },
    {
      id: 6,
      icon: '♾️',
      title: 'Свободное плавание',
      description: 'Самостоятельные тренировки в дорожке в удобное для вас время',
      duration: '90 мин',
      price: 800
    }
  ])

  private pricingData = signal<Pricing[]>([
    {
      id: 1,
      title: 'Базовый',
      price: 3990,
      period: 'месяц',
      features: [
        'Свободное плавание — 8 раз',
        'Раздевалка и душ',
        'Полотенце включено',
        'Работает с 7:00 до 22:00'
      ],
      isPopular: false
    },
    {
      id: 2,
      title: 'Стандарт',
      price: 6990,
      period: 'месяц',
      features: [
        'Безлимитное плавание',
        '2 групповых занятия',
        'Раздевалка и душ',
        'Полотенце включено',
        'Посещение сауны'
      ],
      isPopular: true
    },
    {
      id: 3,
      title: 'Премиум',
      price: 12990,
      period: 'месяц',
      features: [
        'Безлимитное плавание',
        'Безлимитные групповые занятия',
        '4 персональных тренировки',
        'Сауна и джакузи',
        'Персональный шкафчик',
        'Анализ техники плавания'
      ],
      isPopular: false
    }
  ])


  getServices() {
    return this.servicesData()
  }

  getPricing() {
    return this.pricingData()
  }
}
