import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import {Observable, from, of, combineLatest} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {DayAvailability, ScheduleSettings} from '../models/pool.models';
import {BookingService} from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private firestore = inject(Firestore)
  private bookingService = inject(BookingService)

  private defaultSettings: ScheduleSettings = {
    workDays: [1, 2, 3, 4, 5, 6],
    startTime: '09:00',
    endTime: '21:00',
    slotDuration: 60,
    breakSlots: ['13:00']
  }

  getSettings(): Observable<ScheduleSettings> {
    const ref = doc(this.firestore, 'schedule/settings')
    return docData(ref).pipe(
      map(data => (data as ScheduleSettings) || this.defaultSettings),
      catchError(() => of(this.defaultSettings))
    )
  }

  saveSettings(settings: ScheduleSettings): Observable<void> {
    const ref = doc(this.firestore, 'schedule/settings')
    return from(setDoc(ref, settings))
  }

  generateSlots(settings: ScheduleSettings): string[] {
    const slots: string[] = []
    const [startHour, startMin] = settings.startTime.split(':').map(Number)
    const [endHour, endMin] = settings.endTime.split(':').map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    for (let mins = startMinutes; mins < endMinutes; mins += settings.slotDuration) {
      const hour = Math.floor(mins / 60).toString().padStart(2, '0')
      const min = (mins % 60).toString().padStart(2, '0')
      const time = `${hour}:${min}`

      if (settings.breakSlots.includes(time)) continue

      slots.push(time)
    }

    return slots
  }

  isWorkDay(date: Date, settings: ScheduleSettings): boolean {
    return settings.workDays.includes(date.getDay())
  }

  getDayAvailability(dateString: string): Observable<DayAvailability> {
    return combineLatest([
      this.getSettings(),
      this.bookingService.getBookings()
    ]).pipe(
      map(([settings, bookings]) => {
        const date = new Date(dateString)
        const isWorkDay = this.isWorkDay(date, settings)

        if (!isWorkDay) {
          return {
            date: dateString,
            isWorkDay: false,
            totalSlots: 0,
            availableSlots: [],
            bookedSlots: []
          }
        }

        const allSlots = this.generateSlots(settings)

        const bookedSlots = bookings
          .filter(b =>
            b.date === dateString &&
            b.time &&
            b.status !== 'cancelled'
          )
          .map(b => b.time!)

        const availableSlots = allSlots.filter(s => !bookedSlots.includes(s))

        return {
          date: dateString,
          isWorkDay: true,
          totalSlots: allSlots.length,
          availableSlots,
          bookedSlots
        }
      })
    )
  }

  getAvailabilityRange(daysAhead: number = 14): Observable<DayAvailability[]> {
    return combineLatest([
      this.getSettings(),
      this.bookingService.getBookings()
    ]).pipe(
      map(([settings, bookings]) => {
        const result: DayAvailability[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < daysAhead; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() + i)
          const dateString = this.formatDate(date)

          const isWorkDay = this.isWorkDay(date, settings)

          if (!isWorkDay) {
            result.push({
              date: dateString,
              isWorkDay: false,
              totalSlots: 0,
              availableSlots: [],
              bookedSlots: []
            })
            continue
          }

          const allSlots = this.generateSlots(settings)
          const bookedSlots = bookings
            .filter(b =>
              b.date === dateString &&
              b.time &&
              b.status !== 'cancelled'
            )
            .map(b => b.time!)

          let availableSlots = allSlots.filter(s => !bookedSlots.includes(s))

          if (i === 0) {
            const now = new Date()
            const currentMinutes = now.getHours() * 60 + now.getMinutes()
            availableSlots = availableSlots.filter(slot => {
              const [h, m] = slot.split(':').map(Number)
              return (h * 60 + m) > currentMinutes
            })
          }

          result.push({
            date: dateString,
            isWorkDay: true,
            totalSlots: allSlots.length,
            availableSlots,
            bookedSlots
          })
        }

        return result
      })
    )
  }

  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}
