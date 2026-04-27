import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolDataService, Pricing} from '../../core/services/pool.service';
import {PricingCardComponent} from './pricing-card/pricing-card.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, PricingCardComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit{
  private poolService = inject(PoolDataService)
  plans = signal<Pricing[]>([])

  ngOnInit() {
    this.plans.set(this.poolService.getPricing())
  }
}
