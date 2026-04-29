import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear()

  links = [
    { label: 'О нас', href: '#about' },
    { label: 'Услуги', href: '#services' },
    { label: 'Цены', href: '#pricing' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'Контакты', href: '#contact' },
  ]

  socials = [
    { label: 'Instagram', icon: '📸', href: '#' },
    { label: 'Telegram', icon: '✈️', href: '#' },
    { label: 'WhatsApp', icon: '💬', href: '#' },
  ]
}
