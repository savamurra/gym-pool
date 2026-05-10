import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoolService } from '../../core/models/pool.models';
import { BookingService } from '../../core/services/booking.service';
import { ServiceStepComponent } from './service-step/service-step.component';
import { CalendarStepComponent } from './calendar-step/calendar-step.component';
import { ContactStepComponent } from './contact-step/contact-step.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

type Step = 1 | 2 | 3 | 'success'

export interface ContactData {
  name: string
  phone: string
  email: string
  message: string
}

@Component({
  selector: 'app-booking-flow',
  standalone: true,
  imports: [
    CommonModule,
    ServiceStepComponent,
    CalendarStepComponent,
    ContactStepComponent,
    SpinnerComponent,
  ],
  templateUrl: './booking-flow.component.html',
  styleUrl: './booking-flow.component.scss'
})
export class BookingFlowComponent {

  private bookingService = inject(BookingService)

  step = signal<Step>(1)

  selectedService = signal<PoolService | null>(null)
  selectedDate = signal<string | null>(null)
  selectedTime = signal<string | null>(null)

  isSubmitting = signal(false)

  onServiceSelected(service: PoolService) {
    this.selectedService.set(service)
    this.step.set(2)
  }

  onSlotSelected(slot: { date: string, time: string }) {
    this.selectedDate.set(slot.date)
    this.selectedTime.set(slot.time)
    this.step.set(3)
  }

  onContactSubmitted(contact: ContactData) {
    const service = this.selectedService()
    const date = this.selectedDate()
    const time = this.selectedTime()

    if (!service || !date || !time) return

    this.isSubmitting.set(true)

    this.bookingService.createBooking({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      message: contact.message,
      service: service.title,
      date,
      time,
      duration: 60,
      status: 'new',
      createdAt: new Date()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false)
        this.step.set('success')
      },
      error: () => {
        this.isSubmitting.set(false)
      }
    })
  }


  goBack() {
    const current = this.step()
    if (current === 2) this.step.set(1)
    if (current === 3) this.step.set(2)
  }


  reset() {
    this.selectedService.set(null)
    this.selectedDate.set(null)
    this.selectedTime.set(null)
    this.step.set(1)
  }
}
