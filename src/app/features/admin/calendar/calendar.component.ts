import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../core/models/pool.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

interface DayWithBookings {
  date: string
  dayLabel: string
  dateLabel: string
  monthLabel: string
  isToday: boolean
  bookings: Booking[]
  count: number
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  private bookingService = inject(BookingService)

  isLoading = signal(true)

  bookings = toSignal(
    this.bookingService.getBookings().pipe(
      tap(() => this.isLoading.set(false))
    ),
    { initialValue: [] as Booking[] }
  )

  selectedDate = signal<string | null>(null)

  private readonly DAYS_PER_PAGE = 7

  page = signal(0)

  // Все дни (-7 → +21)
  private allDays = computed<DayWithBookings[]>(() => {
    const result: DayWithBookings[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    const monthNames = [
      'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ]

    for (let i = -7; i < 21; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateString = this.formatDate(date)

      const dayBookings = this.bookings()
        .filter(b => b.date === dateString)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))

      result.push({
        date: dateString,
        dayLabel: dayNames[date.getDay()],
        dateLabel: date.getDate().toString(),
        monthLabel: monthNames[date.getMonth()],
        isToday: i === 0,
        bookings: dayBookings,
        count: dayBookings.length
      })
    }

    return result
  })

  visibleDays = computed<DayWithBookings[]>(() => {
    const all = this.allDays()
    const todayIndex = 7   // индекс сегодня в массиве (-7..0)
    const start = todayIndex + this.page() * this.DAYS_PER_PAGE
    return all.slice(start, start + this.DAYS_PER_PAGE)
  })

  canGoPrev = computed(() => {
    const todayIndex = 7
    const start = todayIndex + this.page() * this.DAYS_PER_PAGE
    return start > 0
  })

  canGoNext = computed(() => {
    const todayIndex = 7
    const start = todayIndex + this.page() * this.DAYS_PER_PAGE
    return (start + this.DAYS_PER_PAGE) < this.allDays().length
  })

  selectedDayBookings = computed<Booking[]>(() => {
    const date = this.selectedDate()
    if (!date) return []
    return this.allDays().find(d => d.date === date)?.bookings || []
  })

  bookingsWithoutDate = computed<Booking[]>(() =>
    this.bookings().filter(b => !b.date)
  )

  prevPage() {
    if (this.canGoPrev()) {
      this.page.set(this.page() - 1)
    }
  }

  nextPage() {
    if (this.canGoNext()) {
      this.page.set(this.page() + 1)
    }
  }

  goToToday() {
    this.page.set(0)
  }

  selectDay(day: DayWithBookings) {
    this.selectedDate.set(day.date)
  }

  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  formatFullDate(dateString: string): string {
    const date = new Date(dateString)
    const days = [
      'воскресенье', 'понедельник', 'вторник', 'среда',
      'четверг', 'пятница', 'суббота'
    ]
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
  }

  getStatusLabel(status: BookingStatus): string {
    const labels: Record<BookingStatus, string> = {
      'new': 'Новая',
      'processing': 'В обработке',
      'confirmed': 'Подтверждена',
      'cancelled': 'Отменена'
    }
    return labels[status]
  }
}
