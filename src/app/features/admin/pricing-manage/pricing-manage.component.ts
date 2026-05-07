import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingDataService } from '../../../core/services/pricing-data.service';
import { Pricing } from '../../../core/models/pool.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { PricingFormComponent } from './pricing-form/pricing-form.component';

@Component({
  selector: 'app-pricing-manage',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, PricingFormComponent],
  templateUrl: './pricing-manage.component.html',
  styleUrl: './pricing-manage.component.scss'
})
export class PricingManageComponent {

  private pricingService = inject(PricingDataService)

  plans = toSignal(
    this.pricingService.getPricing(),
    { initialValue: [] as Pricing[] }
  )

  isLoading = signal(true)

  isFormOpen = signal(false)
  editingPlan = signal<Pricing | null>(null)

  constructor() {
    this.pricingService.getPricing().subscribe(() => {
      this.isLoading.set(false)
    })
  }

  openCreateForm() {
    this.editingPlan.set(null)
    this.isFormOpen.set(true)
  }

  openEditForm(plan: Pricing) {
    this.editingPlan.set(plan)
    this.isFormOpen.set(true)
  }

  closeForm() {
    this.isFormOpen.set(false)
    this.editingPlan.set(null)
  }

  onSaved() {
    this.closeForm()
  }

  deletePlan(plan: Pricing) {
    if (!plan.id) return
    if (!confirm(`Удалить тариф "${plan.title}"?`)) return

    this.pricingService.deletePricing(plan.id).subscribe({
      error: (err) => console.error('Ошибка удаления:', err)
    })
  }
}
