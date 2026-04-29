import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { recepcionGuard } from './recepcion-guard';

describe('recepcionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => recepcionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
