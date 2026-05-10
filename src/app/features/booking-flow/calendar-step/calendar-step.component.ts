import { Component, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService,  } from '../../../core/services/schedule.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import {DayAvailability} from '../../../core/models/pool.models';

interface DayCell {
  date: string
  dayLabel: string
  dateLabel: string
  monthLabel: string
  isToday: boolean
  isWorkDay: boolean
  availableCount: number
  isFull: boolean
}

@Component({
  selector: 'app-calendar-step',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './calendar-step.component.html',
  styleUrl: './calendar-step.component.scss'
})
export class CalendarStepComponent {

  private scheduleService = inject(ScheduleService)

  isLoading = signal(true)

  availability = toSignal(
    this.scheduleService.getAvailabilityRange(14).pipe(
      tap(() => this.isLoading.set(false))
    ),
    { initialValue: [] as DayAvailability[] }
  )

  days = computed<DayCell[]>(() => {
    return this.availability().map((day, index) => {
      const date = new Date(day.date)
      const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      const monthNames = [
        'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
      ]

      return {
        date: day.date,
        dayLabel: dayNames[date.getDay()],
        dateLabel: date.getDate().toString(),
        monthLabel: monthNames[date.getMonth()],
        isToday: index === 0,
        isWorkDay: day.isWorkDay,
        availableCount: day.availableSlots.length,
        isFull: day.isWorkDay && day.availableSlots.length === 0
      }
    })
  })

  selectedDate = signal<string | null>(null)

  selectedDaySlots = computed<string[]>(() => {
    const date = this.selectedDate()
    if (!date) return []
    const day = this.availability().find(d => d.date === date)
    return day?.availableSlots || []
  })

  back = output<void>()
  slotSelected = output<{ date: string, time: string }>()

  selectDay(day: DayCell) {
    if (!day.isWorkDay || day.isFull) return
    this.selectedDate.set(day.date)
  }

  selectSlot(time: string) {
    const date = this.selectedDate()
    if (!date) return
    this.slotSelected.emit({ date, time })
  }

  onBack() {
    this.back.emit()
  }
}
