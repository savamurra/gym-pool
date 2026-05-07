import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ServicesDataService } from '../../../../core/services/services-data.service';
import { PoolService } from '../../../../core/models/pool.models';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit {

  private servicesService = inject(ServicesDataService)

  service = input<PoolService | null>(null)

  closed = output<void>()
  saved = output<void>()

  isSubmitting = false

  form = new FormGroup({
    icon: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    duration: new FormControl('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    order: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  })

  ngOnInit() {
    const existing = this.service()
    if (existing) {
      this.form.patchValue({
        icon: existing.icon,
        title: existing.title,
        description: existing.description,
        duration: existing.duration,
        price: existing.price,
        order: existing.order,
      })
    }
  }

  get f() { return this.form.controls }

  showError(field: string): boolean {
    const control = this.form.get(field)
    return !!(control?.invalid && control?.touched)
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const data: Omit<PoolService, 'id'> = {
      icon: this.f.icon.value!,
      title: this.f.title.value!,
      description: this.f.description.value!,
      duration: this.f.duration.value!,
      price: this.f.price.value!,
      order: this.f.order.value!,
    }

    const existing = this.service()

    const operation$: Observable<void | string> = existing?.id
      ? this.servicesService.updateService(existing.id, data)
      : this.servicesService.createService(data)

    operation$.subscribe({
      next: () => {
        this.isSubmitting = false
        this.saved.emit()
      },
      error: () => {
        this.isSubmitting = false
      }
    })
  }

  close() {
    this.closed.emit()
  }
}
