import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'auth-action-complete',
    loadComponent: () =>
      import('./auth-action-complete/auth-action-complete.page').then((m) => m.AuthActionCompletePage),
  },
];
