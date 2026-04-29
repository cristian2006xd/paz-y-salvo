import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { exFuncionarioGuard } from './ex-funcionario-guard';

describe('exFuncionarioGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => exFuncionarioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
