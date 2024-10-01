import { Routes } from '@angular/router';
import { AuthGuardService } from '@app/core';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tea-list',
        canActivate: [AuthGuardService],
        loadComponent: () => import('../tea-list/tea-list.page').then((m) => m.TeaListPage),
      },
      {
        path: 'vault-control',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../vault-control/vault-control.routes').then((m) => m.routes),
      },
      {
        path: 'about',
        canActivate: [AuthGuardService],
        loadComponent: () => import('../about/about.page').then((m) => m.AboutPage),
      },
    ],
  },
];
