import { NavController, Platform } from '@ionic/angular';

export const createNavControllerMock = () =>
  jasmine.createSpyObj<NavController>('NavController', ['navigateForward', 'navigateRoot']);

export const createOverlayElementMock = (name: string) =>
  jasmine.createSpyObj(name, {
    dismiss: Promise.resolve(),
    onDidDismiss: Promise.resolve(),
    onWillDismiss: Promise.resolve(),
    present: Promise.resolve(),
  });

export const createOverlayControllerMock = (name: string, element?: any) => {
  const e = element || createOverlayElementMock('unknown');
  return jasmine.createSpyObj(name, {
    create: Promise.resolve(e),
    dismiss: undefined,
    getTop: Promise.resolve(e),
  });
};

export const createPlatformMock = () =>
  jasmine.createSpyObj<Platform>('Platform', {
    is: false,
    ready: Promise.resolve('ready'),
  });
