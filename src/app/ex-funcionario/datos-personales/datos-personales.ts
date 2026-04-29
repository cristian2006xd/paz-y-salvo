import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.css'
})
export class DatosPersonales {
  usuario: any = null;

  datos = {
    cedula: '',
    telefono: '',
    correo: '',
    direccion: '',
    cargo: '',
    unidad: ''
  };

  mensaje = '';

  constructor() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;
  }

  guardar(): void {
    this.mensaje = 'Datos personales guardados correctamente.';
  }
}