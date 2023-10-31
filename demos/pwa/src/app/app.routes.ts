import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((c) => c.LoginPage),
  },
  {
    path: 'start',
    loadComponent: () => import('./start/start.page').then((c) => c.StartPage),
  },
  {
    path: 'unlock',
    loadComponent: () => import('./unlock/unlock.page').then((c) => c.UnlockPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((c) => c.routes),
  },
  {
    path: 'auth-action-complete',
    loadComponent: () =>
      import('./auth-action-complete/auth-action-complete.page').then((m) => m.AuthActionCompletePage),
  },
];
