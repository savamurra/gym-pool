import { Injectable, inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from './booking.service';
import { ServicesDataService } from './services-data.service';
import {AnalyticsData, Booking, DayStats, PoolService, ServiceStats, StatusStats} from '../models/pool.models';



@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private bookingService = inject(BookingService)
  private servicesService = inject(ServicesDataService)

  getAnalytics(): Observable<AnalyticsData> {
    return combineLatest([
      this.bookingService.getBookings(),
      this.servicesService.getServices()
    ]).pipe(
      map(([bookings, services]) => this.calculate(bookings, services))
    )
  }

  private calculate(bookings: Booking[], services: PoolService[]): AnalyticsData {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayBookings = bookings.filter(b => {
      const date = new Date(b.createdAt)
      date.setHours(0, 0, 0, 0)
      return date.getTime() === today.getTime()
    }).length

    const confirmed = bookings.filter(b => b.status === 'confirmed').length
    const conversionRate = bookings.length > 0
      ? Math.round((confirmed / bookings.length) * 100)
      : 0

    const potentialRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => {
        const service = services.find(s => this.matchService(s.title, b.service))
        return sum + (service?.price || 0)
      }, 0)

    return {
      bookings,
      services,
      totalBookings: bookings.length,
      todayBookings,
      conversionRate,
      potentialRevenue,
      byDay: this.groupByDay(bookings),
      byService: this.groupByService(bookings, services),
      byStatus: this.groupByStatus(bookings)
    }
  }

  private matchService(serviceTitle: string, bookingService: string): boolean {
    const map: Record<string, string> = {
      'swimming': 'Спортивное плавание',
      'aquafitness': 'Аквафитнес',
      'aquayoga': 'Аквайога',
      'kids': 'Детское плавание',
      'polo': 'Водное поло',
      'free': 'Свободное плавание',
    }
    return serviceTitle === map[bookingService] || serviceTitle === bookingService
  }

  private groupByDay(bookings: Booking[]): DayStats[] {
    const days: DayStats[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const count = bookings.filter(b => {
        const bDate = new Date(b.createdAt)
        bDate.setHours(0, 0, 0, 0)
        return bDate.getTime() === date.getTime()
      }).length

      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')

      days.push({ date: `${day}.${month}`, count })
    }

    return days
  }

  private groupByService(bookings: Booking[], services: PoolService[]): ServiceStats[] {
    const stats = services.map(service => {
      const serviceBookings = bookings.filter(b =>
        this.matchService(service.title, b.service)
      )
      return {
        title: service.title,
        count: serviceBookings.length,
        revenue: serviceBookings.length * service.price
      }
    })

    return stats
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  private groupByStatus(bookings: Booking[]): StatusStats {
    return {
      new: bookings.filter(b => b.status === 'new').length,
      processing: bookings.filter(b => b.status === 'processing').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    }
  }
}
