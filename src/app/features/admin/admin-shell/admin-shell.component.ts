import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {ThemeToggleComponent} from '../../../shared/components/theme-toggle/theme-toggle.component';

interface NavItem {
  label: string
  icon: string
  route: string
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss'
})
export class AdminShellComponent {

  authService = inject(AuthService)

  isSidebarOpen = signal(true)

  navItems: NavItem[] = [
    { label: 'Дашборд', icon: '📊', route: '/admin/dashboard' },
    { label: 'Заявки', icon: '📋', route: '/admin/bookings' },
    { label: 'Услуги', icon: '🏊', route: '/admin/services' },
    { label: 'Цены', icon: '💰', route: '/admin/pricing' },
  ]

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen())
  }
}
