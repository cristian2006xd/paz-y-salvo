import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const exFuncionarioGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (usuario?.rol === 'ex_funcionario') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};