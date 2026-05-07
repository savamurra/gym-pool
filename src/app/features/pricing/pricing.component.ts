import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingDataService } from '../../core/services/pricing-data.service';
import { Pricing } from '../../core/models/pool.models';
import { PricingCardComponent } from './pricing-card/pricing-card.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, PricingCardComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {

  private pricingService = inject(PricingDataService)

  plans = toSignal(
    this.pricingService.getPricing(),
    { initialValue: [] as Pricing[] }
  )
}
