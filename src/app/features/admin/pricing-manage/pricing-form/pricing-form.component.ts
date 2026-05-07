import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PricingDataService } from '../../../../core/services/pricing-data.service';
import { Pricing } from '../../../../core/models/pool.models';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-pricing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './pricing-form.component.html',
  styleUrl: './pricing-form.component.scss'
})
export class PricingFormComponent implements OnInit {

  private pricingService = inject(PricingDataService)

  pricing = input<Pricing | null>(null)

  closed = output<void>()
  saved = output<void>()

  isSubmitting = false

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    period: new FormControl('месяц', [Validators.required]),
    isPopular: new FormControl(false),
    order: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    features: new FormArray<FormControl<string | null>>([], [Validators.required, Validators.minLength(1)])  })

  ngOnInit() {
    const existing = this.pricing()
    if (existing) {
      this.form.patchValue({
        title: existing.title,
        price: existing.price,
        period: existing.period,
        isPopular: existing.isPopular,
        order: existing.order,
      })
      existing.features.forEach(feature => {
        this.featuresArray.push(new FormControl(feature, Validators.required))
      })
    } else {
      this.addFeature()
    }
  }

  get featuresArray() {
    return this.form.get('features') as FormArray<FormControl<string | null>>
  }

  get f() { return this.form.controls }

  addFeature() {
    this.featuresArray.push(new FormControl('', Validators.required))
  }

  removeFeature(index: number) {
    if (this.featuresArray.length === 1) return
    this.featuresArray.removeAt(index)
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

    this.isSubmitting = true

    const data: Omit<Pricing, 'id'> = {
      title: this.f.title.value!,
      price: this.f.price.value!,
      period: this.f.period.value!,
      isPopular: this.f.isPopular.value!,
      order: this.f.order.value!,
      features: this.featuresArray.value.filter((f): f is string => !!f),
    }

    const existing = this.pricing()

    const operation$: Observable<void | string> = existing?.id
      ? this.pricingService.updatePricing(existing.id, data)
      : this.pricingService.createPricing(data)

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
