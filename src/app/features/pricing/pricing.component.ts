import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolDataService} from '../../core/services/pool.service';
import {PricingCardComponent} from './pricing-card/pricing-card.component';
import {Pricing} from '../../core/models/pool.models';

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
