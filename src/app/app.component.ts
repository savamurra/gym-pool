import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './layout/header/header.component';
import {HeroComponent} from './features/hero/hero.component';
import {ServicesComponent} from './features/services/services.component';
import {PricingComponent} from './features/pricing/pricing.component';
import {ContactComponent} from './features/contact/contact.component';
import {AboutComponent} from './features/about/about.component';
import {GalleryComponent} from './features/gallery/gallery.component';
import {FooterComponent} from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeroComponent, ServicesComponent, PricingComponent, ContactComponent, AboutComponent, GalleryComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pool-gym-landing';
}
