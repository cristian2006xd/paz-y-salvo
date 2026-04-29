import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { talentoHumanoGuard } from './talento-humano-guard';

describe('talentoHumanoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => talentoHumanoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
