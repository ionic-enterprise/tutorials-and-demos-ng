import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./start/start.page').then((m) => m.StartPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'unlock',
    loadComponent: () => import('./unlock/unlock.page').then((m) => m.UnlockPage),
  },
  {
    path: 'auth-action-complete',
    loadComponent: () =>
      import('./auth-action-complete/auth-action-complete.page').then((m) => m.AuthActionCompletePage),
  },
];
