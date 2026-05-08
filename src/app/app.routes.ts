import { Routes } from '@angular/router';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/landing/landing.component')
        .then(m => m.LandingComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-shell/admin-shell.component')
        .then(m => m.AdminShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/admin/bookings/bookings.component')
            .then(m => m.BookingsComponent)
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/admin/services-manage/services-manage.component')
            .then(m => m.ServicesManageComponent)
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./features/admin/pricing-manage/pricing-manage.component')
            .then(m => m.PricingManageComponent)
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/admin/schedule-settings/schedule-settings.component')
            .then(m => m.ScheduleSettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
