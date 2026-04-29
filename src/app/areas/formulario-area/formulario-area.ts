import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulario-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-area.html',
  styleUrl: './formulario-area.css'
})
export class FormularioArea implements OnInit {

  area: any = null;

  form = {
    responsable: '',
    detalle: '',
    observacion: ''
  };

  mensaje = '';
  error = '';
  cargando = true;

  usuario: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario?.area) {
      this.error = 'No se pudo identificar el área.';
      this.cargando = false;
      return;
    }

    this.cargarArea();
  }

  cargarArea(): void {
    const url = `http://localhost:5000/api/areas/pendiente/${this.usuario.area}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.area = res;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No hay solicitudes pendientes.';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.form.responsable || !this.form.detalle) {
      this.error = 'Complete los campos obligatorios';
      return;
    }

    const url = `http://localhost:5000/api/areas/formulario/${this.area.id}`;

    this.http.put(url, this.form).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje;
        this.cargarArea();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al guardar';
      }
    });
  }
}