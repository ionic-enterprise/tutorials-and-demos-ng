import { Routes } from '@angular/router';
import { VaultControlPage } from './vault-control.page';

export const routes: Routes = [
  {
    path: '',
    component: VaultControlPage,
  },
  {
    path: 'device-info',
    loadComponent: () => import('./device-info/device-info.page').then((m) => m.DeviceInfoPage),
  },
  {
    path: 'value-list',
    loadComponent: () => import('./value-list/value-list.page').then((m) => m.ValueListPage),
  },
];
