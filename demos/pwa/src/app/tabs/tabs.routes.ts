import { Routes } from '@angular/router';
import { authGuard } from '@app/core';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tea',
        canActivate: [authGuard],
        loadComponent: () => import('../tea/tea.page').then((c) => c.TeaPage),
      },
      {
        path: 'tea/tea-details/:id',
        canActivate: [authGuard],
        loadComponent: () => import('../tea-details/tea-details.page').then((c) => c.TeaDetailsPage),
      },
      {
        path: 'tasting-notes',
        canActivate: [authGuard],
        loadComponent: () => import('../tasting-notes/tasting-notes.page').then((c) => c.TastingNotesPage),
      },
      {
        path: 'about',
        canActivate: [authGuard],
        loadComponent: () => import('../about/about.page').then((c) => c.AboutPage),
      },
      {
        path: '',
        redirectTo: '/tabs/tea',
        pathMatch: 'full',
      },
    ],
  },
];
