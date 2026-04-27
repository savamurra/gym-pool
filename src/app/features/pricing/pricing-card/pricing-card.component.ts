import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Pricing} from '../../../core/models/pool.models';

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.scss'
})
export class PricingCardComponent {
  plan = input.required<Pricing>()
}
