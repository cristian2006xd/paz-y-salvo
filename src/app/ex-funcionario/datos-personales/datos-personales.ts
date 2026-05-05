import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.css'
})
export class DatosPersonales implements OnInit {

  usuario: any = null;

  datos = {
    cedula: '',
    telefono: '',
    correo: '',
    direccion: '',
    cargo: '',
    unidad: ''
  };

  cargando = false;
  mensaje = '';
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario?.id) {
      this.error = 'No se pudo identificar al usuario.';
      return;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<any>(`http://localhost:5000/api/usuarios/${this.usuario.id}/datos`)
      .subscribe({
        next: (res: any) => {
          this.datos = {
            cedula: res.cedula || '',
            telefono: res.telefono || '',
            correo: res.correo || '',
            direccion: res.direccion || '',
            cargo: res.cargo || '',
            unidad: res.unidad || ''
          };
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
        }
      });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.datos.cedula.trim() ||
      !this.datos.telefono.trim() ||
      !this.datos.correo.trim()
    ) {
      this.error = 'Cédula, teléfono y correo son obligatorios.';
      return;
    }

    this.cargando = true;

    this.http.put<any>(
      `http://localhost:5000/api/usuarios/${this.usuario.id}/datos`,
      this.datos
    ).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Datos personales guardados correctamente.';
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar los datos.';
        this.cargando = false;
      }
    });
  }
}