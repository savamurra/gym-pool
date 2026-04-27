import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  isSubmitted = signal(false)
  isSubmitting = signal(false)

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

    setTimeout(() => {
      console.log('Форма отправлена:', this.form.value)
      this.isSubmitting.set(false)
      this.isSubmitted.set(true)
      this.form.reset()
    }, 1500)
  }
}
