import { EMPTY } from 'rxjs';

export const createActivatedRouteMock = () => ({
  snapshot: {
    paramMap: jasmine.createSpyObj('Snapshot', ['get']),
  },
});

export const createSwUpdateMock = () => {
  const mock = jasmine.createSpyObj('SwUpdate', {
    activateUpdate: Promise.resolve(),
  });
  mock.available = EMPTY;
  return mock;
};
