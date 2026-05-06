import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  private bookingService = inject(BookingService)

  isSubmitting = signal(false)
  isSubmitted = signal(false)

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?[\d\s\-()]{10,16}$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    service: new FormControl('', [
      Validators.required
    ]),
    message: new FormControl('')
  })

  get f() {
    return this.form.controls
  }

  showError(field: string): boolean {
    const control = this.form.get(field)
    return !!(control?.invalid && control?.touched)
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.isSubmitting.set(true)

    this.bookingService.createBooking({
      name: this.f.name.value!,
      phone: this.f.phone.value!,
      email: this.f.email.value!,
      service: this.f.service.value!,
      message: this.f.message.value || '',
      status: 'new',
      createdAt: new Date()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false)
        this.isSubmitted.set(true)
        this.form.reset()
      },
      error: () => {
        this.isSubmitting.set(false)
      }
    })
  }
}
