import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ScheduleService } from '../../../core/services/schedule.service';
import { ScheduleSettings } from '../../../core/models/pool.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

interface DayOption {
  value: number
  label: string
}

@Component({
  selector: 'app-schedule-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './schedule-settings.component.html',
  styleUrl: './schedule-settings.component.scss'
})
export class ScheduleSettingsComponent {

  private scheduleService = inject(ScheduleService)

  isLoading = signal(true)
  isSaving = signal(false)
  saveMessage = signal<string>('')

  days: DayOption[] = [
    { value: 1, label: 'Пн' },
    { value: 2, label: 'Вт' },
    { value: 3, label: 'Ср' },
    { value: 4, label: 'Чт' },
    { value: 5, label: 'Пт' },
    { value: 6, label: 'Сб' },
    { value: 0, label: 'Вс' },
  ]

  previewSlots = signal<string[]>([])

  form = new FormGroup({
    startTime: new FormControl('09:00', [Validators.required]),
    endTime: new FormControl('21:00', [Validators.required]),
    slotDuration: new FormControl<number>(60, [Validators.required, Validators.min(15)]),
    workDays: new FormArray<FormControl<number | null>>([]),
    breakSlots: new FormArray<FormControl<string | null>>([]),
  })

  constructor() {
    this.scheduleService.getSettings().subscribe(settings => {
      this.applySettings(settings)
      this.isLoading.set(false)
      this.updatePreview()
    })

    this.form.valueChanges.subscribe(() => this.updatePreview())
  }

  private applySettings(settings: ScheduleSettings) {
    this.form.patchValue({
      startTime: settings.startTime,
      endTime: settings.endTime,
      slotDuration: settings.slotDuration,
    })

    const workDaysArray = this.form.get('workDays') as FormArray<FormControl<number | null>>
    workDaysArray.clear()
    settings.workDays.forEach(day => {
      workDaysArray.push(new FormControl(day))
    })

    const breaksArray = this.form.get('breakSlots') as FormArray<FormControl<string | null>>
    breaksArray.clear()
    settings.breakSlots.forEach(time => {
      breaksArray.push(new FormControl(time))
    })
  }

  get workDaysArray() {
    return this.form.get('workDays') as FormArray<FormControl<number | null>>
  }

  get breaksArray() {
    return this.form.get('breakSlots') as FormArray<FormControl<string | null>>
  }

  toggleDay(value: number) {
    const arr = this.workDaysArray
    const index = arr.controls.findIndex(c => c.value === value)
    if (index >= 0) {
      arr.removeAt(index)
    } else {
      arr.push(new FormControl(value))
    }
  }

  isDayActive(value: number): boolean {
    return this.workDaysArray.controls.some(c => c.value === value)
  }

  addBreak() {
    this.breaksArray.push(new FormControl('13:00'))
  }

  removeBreak(index: number) {
    this.breaksArray.removeAt(index)
  }

  private updatePreview() {
    const value = this.form.value
    if (!value.startTime || !value.endTime || !value.slotDuration) {
      this.previewSlots.set([])
      return
    }

    const settings: ScheduleSettings = {
      startTime: value.startTime,
      endTime: value.endTime,
      slotDuration: value.slotDuration,
      workDays: (value.workDays || []).filter((d): d is number => d !== null),
      breakSlots: (value.breakSlots || []).filter((s): s is string => !!s),
    }

    try {
      const slots = this.scheduleService.generateSlots(settings)
      this.previewSlots.set(slots)
    } catch {
      this.previewSlots.set([])
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.isSaving.set(true)
    this.saveMessage.set('')

    const value = this.form.value
    const settings: ScheduleSettings = {
      startTime: value.startTime!,
      endTime: value.endTime!,
      slotDuration: value.slotDuration!,
      workDays: (value.workDays || []).filter((d): d is number => d !== null),
      breakSlots: (value.breakSlots || []).filter((s): s is string => !!s),
    }

    this.scheduleService.saveSettings(settings).subscribe({
      next: () => {
        this.isSaving.set(false)
        this.saveMessage.set('✅ Сохранено')
        setTimeout(() => this.saveMessage.set(''), 3000)
      },
      error: () => {
        this.isSaving.set(false)
        this.saveMessage.set('❌ Ошибка сохранения')
      }
    })
  }
}
