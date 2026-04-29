import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const areaGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (usuario?.rol === 'area') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};