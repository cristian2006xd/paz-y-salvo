import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usuario = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.error = '';

    const usuario = this.usuario.trim();
    const password = this.password.trim();

    if (!usuario || !password) {
      this.error = 'Ingrese usuario y contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.login({ usuario, password }).subscribe({
      next: (res: any) => {
        this.authService.guardarSesion(res);

        const rol = res.usuario?.rol;

        const rutas: any = {
          admin: '/admin/dashboard',
          talento_humano: '/talento-humano/dashboard',
          ex_funcionario: '/ex-funcionario/dashboard',
          area: '/areas/formulario-area',
          recepcion: '/recepcion/dashboard'
        };

        if (!rutas[rol]) {
          this.error = 'Rol no reconocido.';
          this.cargando = false;
          return;
        }

        this.router.navigate([rutas[rol]]);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Usuario o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}