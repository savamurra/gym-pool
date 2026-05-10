import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PoolService } from '../../../core/models/pool.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ContactData } from '../booking-flow.component';

@Component({
  selector: 'app-contact-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './contact-step.component.html',
  styleUrl: './contact-step.component.scss'
})
export class ContactStepComponent {

  service = input.required<PoolService>()
  date = input.required<string>()
  time = input.required<string>()
  isSubmitting = input<boolean>(false)

  back = output<void>()
  submitted = output<ContactData>()

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?[\d\s\-()]{10,16}$/)
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('')
  })

  get f() { return this.form.controls }

  showError(field: string): boolean {
    const control = this.form.get(field)
    return !!(control?.invalid && control?.touched)
  }

  formatDate(dateString: string): string {
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

  onBack() {
    this.back.emit()
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.submitted.emit({
      name: this.f.name.value!,
      phone: this.f.phone.value!,
      email: this.f.email.value!,
      message: this.f.message.value || ''
    })
  }
}
