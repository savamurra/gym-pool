import { Routes } from '@angular/router';

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
