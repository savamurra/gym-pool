import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ScheduleSettings } from '../models/pool.models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private firestore = inject(Firestore)

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
}
