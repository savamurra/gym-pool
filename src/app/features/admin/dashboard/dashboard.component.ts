import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookingService} from '../../../core/services/booking.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {Booking, BookingStatus} from '../../../core/models/pool.models';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private bookingService = inject(BookingService)

  bookings = toSignal(this.bookingService.getBookings(), {initialValue: [] as Booking[]})

  totalBookings = computed(() => this.bookings().length)

  newBookings = computed(() =>
    this.bookings().filter(booking => booking.status === 'new').length)

  confirmedBookings = computed(() =>
    this.bookings().filter(booking => booking.status === 'confirmed').length)

  cancelledBookings = computed(() =>
    this.bookings().filter(booking => booking.status === 'cancelled').length)

  recentBookings = computed(() =>
  this.bookings().slice(0, 5))

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
