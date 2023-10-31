import { Routes } from '@angular/router';
import { authGuard } from '@app/core';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'tea',
        loadComponent: () => import('../tea/tea.page').then((c) => c.TeaPage),
      },
      {
        path: 'tea/tea-details/:id',
        loadComponent: () => import('../tea-details/tea-details.page').then((c) => c.TeaDetailsPage),
      },
      {
        path: 'tasting-notes',
        loadComponent: () => import('../tasting-notes/tasting-notes.page').then((c) => c.TastingNotesPage),
      },
      {
        path: 'about',
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
