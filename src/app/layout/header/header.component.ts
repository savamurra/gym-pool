import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeToggleComponent} from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = signal(false)

  navLinks = [
    {label: 'О нас', href: '#about'},
    {label: 'Услуги', href: '#services'},
    {label: 'Цены', href: '#pricing'},
    {label: 'Галерея', href: '#gallery'},
    {label: 'Контакты', href: '#contact'},
  ]

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen())
  }
}
