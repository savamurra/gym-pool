import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../core/models/pool.models';
import { toSignal } from '@angular/core/rxjs-interop';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';

type FilterStatus = 'all' | BookingStatus

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {

  private bookingService = inject(BookingService)

  bookings = toSignal(
    this.bookingService.getBookings(),
    { initialValue: [] as Booking[] }
  )

  isLoading = signal(true)

  constructor() {
    this.bookingService.getBookings().subscribe(() => {
      this.isLoading.set(false)
    })
  }

  activeFilter = signal<FilterStatus>('all')

  selectedBookingId = signal<string | null>(null)


  selectedBooking = computed(() => {
    const id = this.selectedBookingId()
    if (!id) return null
    return this.bookings().find(b => b.id === id) ?? null
  })

  filteredBookings = computed(() => {
    const filter = this.activeFilter()
    const all = this.bookings()
    if (filter === 'all') return all
    return all.filter(b => b.status === filter)
  })

  counts = computed(() => ({
    all: this.bookings().length,
    new: this.bookings().filter(b => b.status === 'new').length,
    processing: this.bookings().filter(b => b.status === 'processing').length,
    confirmed: this.bookings().filter(b => b.status === 'confirmed').length,
    cancelled: this.bookings().filter(b => b.status === 'cancelled').length,
  }))

  filters: { label: string, value: FilterStatus }[] = [
    { label: 'Все', value: 'all' },
    { label: 'Новые', value: 'new' },
    { label: 'В обработке', value: 'processing' },
    { label: 'Подтверждены', value: 'confirmed' },
    { label: 'Отменены', value: 'cancelled' },
  ]

  statuses: { label: string, value: BookingStatus }[] = [
    { label: 'Новая', value: 'new' },
    { label: 'В обработке', value: 'processing' },
    { label: 'Подтверждена', value: 'confirmed' },
    { label: 'Отменена', value: 'cancelled' },
  ]

  setFilter(filter: FilterStatus) {
    this.activeFilter.set(filter)
  }

  selectBooking(booking: Booking) {
    this.selectedBookingId.set(booking.id ?? null)
  }

  closeDetail() {
    this.selectedBookingId.set(null)
  }

  updateStatus(booking: Booking, status: BookingStatus) {
    if (!booking.id) return
    this.bookingService.updateStatus(booking.id, status).subscribe({
      error: (err) => console.error('Ошибка обновления статуса:', err)
    })

  }

  deleteBooking(booking: Booking) {
    if (!booking.id) return
    if (!confirm('Удалить заявку?')) return
    this.bookingService.deleteBooking(booking.id).subscribe({
      error: (err) => console.error('Ошибка удаления:', err)
    })
    this.closeDetail()
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

  getServiceLabel(service: string): string {
    const services: Record<string, string> = {
      'swimming': 'Спортивное плавание',
      'aquafitness': 'Аквафитнес',
      'aquayoga': 'Аквайога',
      'kids': 'Детское плавание',
      'polo': 'Водное поло',
      'free': 'Свободное плавание',
    }
    return services[service] || service
  }
}
