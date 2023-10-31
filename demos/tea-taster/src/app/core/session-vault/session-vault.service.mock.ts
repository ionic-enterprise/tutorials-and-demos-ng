export const createSessionVaultServiceMock = () =>
  jasmine.createSpyObj('SessionVaultService', {
    set: Promise.resolve(),
    get: Promise.resolve(),
    clear: Promise.resolve(),
  });
