import { Booking, BookingStatus, PoolService, Pricing } from '../models/pool.models'

export const TEST_SERVICES: Omit<PoolService, 'id'>[] = [
  {
    icon: '🏊',
    title: 'Спортивное плавание',
    description: 'Тренировки с профессиональным тренером для улучшения техники и скорости плавания',
    duration: '60 мин',
    price: 1500,
    order: 1
  },
  {
    icon: '💪',
    title: 'Аквафитнес',
    description: 'Групповые тренировки в воде для укрепления мышц и похудения без нагрузки на суставы',
    duration: '45 мин',
    price: 1200,
    order: 2
  },
  {
    icon: '🧘',
    title: 'Аквайога',
    description: 'Расслабляющие практики в воде для улучшения гибкости и снятия стресса',
    duration: '60 мин',
    price: 1300,
    order: 3
  },
  {
    icon: '👶',
    title: 'Детское плавание',
    description: 'Обучение детей плаванию с нуля в безопасной и комфортной атмосфере',
    duration: '45 мин',
    price: 1400,
    order: 4
  },
  {
    icon: '🤽',
    title: 'Водное поло',
    description: 'Командная игра в воде для развития выносливости и командного духа',
    duration: '90 мин',
    price: 1800,
    order: 5
  },
  {
    icon: '♾️',
    title: 'Свободное плавание',
    description: 'Самостоятельные тренировки в дорожке в удобное для вас время',
    duration: '90 мин',
    price: 800,
    order: 6
  }
]

export const TEST_PRICING: Omit<Pricing, 'id'>[] = [
  {
    title: 'Базовый',
    price: 3990,
    period: 'месяц',
    isPopular: false,
    order: 1,
    features: [
      'Свободное плавание — 8 раз',
      'Раздевалка и душ',
      'Полотенце включено',
      'Работает с 7:00 до 22:00'
    ]
  },
  {
    title: 'Стандарт',
    price: 6990,
    period: 'месяц',
    isPopular: true,
    order: 2,
    features: [
      'Безлимитное плавание',
      '2 групповых занятия',
      'Раздевалка и душ',
      'Полотенце включено',
      'Посещение сауны'
    ]
  },
  {
    title: 'Премиум',
    price: 12990,
    period: 'месяц',
    isPopular: false,
    order: 3,
    features: [
      'Безлимитное плавание',
      'Безлимитные групповые занятия',
      '4 персональных тренировки',
      'Сауна и джакузи',
      'Персональный шкафчик',
      'Анализ техники плавания'
    ]
  }
]

const NAMES = [
  'Алишер Жумабеков', 'Айгуль Касымова', 'Бекзат Орозов', 'Динара Султанова',
  'Эрлан Токтогулов', 'Жанна Бектурсунова', 'Канат Исаков', 'Мээрим Асанова',
  'Нурлан Дуйшеев', 'Айбек Мамбетов', 'Гульнара Тургунбаева', 'Темирлан Кадыров',
  'Айдай Жунушова', 'Болот Алыбаев', 'Чолпон Чыныбаева', 'Рустам Эрмеков'
]

const SERVICES_KEYS = ['swimming', 'aquafitness', 'aquayoga', 'kids', 'polo', 'free']
const STATUSES: BookingStatus[] = ['new', 'processing', 'confirmed', 'cancelled']

const MESSAGES = [
  'Хочу записаться на пробное занятие',
  'Можно прийти с ребёнком?',
  'Какое расписание у тренера?',
  '',
  'Звоните после 18:00',
  '',
  'Интересует абонемент',
  ''
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone(): string {
  const part1 = Math.floor(Math.random() * 900) + 100
  const part2 = Math.floor(Math.random() * 900) + 100
  const part3 = Math.floor(Math.random() * 900) + 100
  return `+996 ${part1} ${part2} ${part3}`
}

function randomEmail(name: string): string {
  const translit: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
    'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
    'ю': 'yu', 'я': 'ya'
  }
  const firstName = name.split(' ')[0].toLowerCase()
  const transliterated = firstName.split('').map(c => translit[c] || c).join('')
  return `${transliterated}${Math.floor(Math.random() * 99)}@gmail.com`
}

function randomDate(daysBack: number): Date {
  const now = new Date()
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
  const random = past.getTime() + Math.random() * (now.getTime() - past.getTime())
  return new Date(random)
}

function realisticStatus(): BookingStatus {
  const rand = Math.random()
  if (rand < 0.25) return 'new'
  if (rand < 0.45) return 'processing'
  if (rand < 0.85) return 'confirmed'
  return 'cancelled'
}

export function generateTestBookings(count: number = 30): Omit<Booking, 'id'>[] {
  const bookings: Omit<Booking, 'id'>[] = []

  for (let i = 0; i < count; i++) {
    const name = pick(NAMES)
    bookings.push({
      name,
      phone: randomPhone(),
      email: randomEmail(name),
      service: pick(SERVICES_KEYS),
      message: pick(MESSAGES),
      status: realisticStatus(),
      createdAt: randomDate(14)
    })
  }

  return bookings
}
