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

    if (!this.usuario.trim() || !this.password.trim()) {
      this.error = 'Ingrese usuario y contraseña';
      return;
    }

    this.cargando = true;

    this.authService.login({
      usuario: this.usuario,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.guardarSesion(res);

        const rol = res.usuario.rol;

        if (rol === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (rol === 'talento_humano') {
          this.router.navigate(['/talento-humano/dashboard']);
        } else if (rol === 'ex_funcionario') {
          this.router.navigate(['/ex-funcionario/dashboard']);
        } else if (rol === 'area') {
          this.router.navigate(['/areas/formulario-area']);
        } else if (rol === 'recepcion') {
          this.router.navigate(['/recepcion/dashboard']);
        } else {
          this.error = 'Rol no reconocido';
          this.cargando = false;
        }
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.mensaje || 'Error al iniciar sesión';
      }
    });
  }
}