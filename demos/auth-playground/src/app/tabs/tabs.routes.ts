import { Routes } from '@angular/router';
import { AuthGuardService } from '@app/core';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'tea-list',
        loadComponent: () => import('../tea-list/tea-list.page').then((m) => m.TeaListPage),
      },
      {
        path: 'vault-control',
        loadChildren: () => import('../vault-control/vault-control.routes').then((m) => m.routes),
      },
      {
        path: 'about',
        loadComponent: () => import('../about/about.page').then((m) => m.AboutPage),
      },
    ],
  },
];
