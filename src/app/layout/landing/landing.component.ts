import {Component} from '@angular/core';
import {FooterComponent} from '../footer/footer.component';
import {HeaderComponent} from '../header/header.component';
import {HeroComponent} from '../../features/hero/hero.component';
import {AboutComponent} from '../../features/about/about.component';
import {ServicesComponent} from '../../features/services/services.component';
import {PricingComponent} from '../../features/pricing/pricing.component';
import {GalleryComponent} from '../../features/gallery/gallery.component';
import {ContactComponent} from '../../features/contact/contact.component';
import {BookingFlowComponent} from '../../features/booking-flow/booking-flow.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    PricingComponent,
    GalleryComponent,
    ContactComponent,
    FooterComponent, BookingFlowComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
