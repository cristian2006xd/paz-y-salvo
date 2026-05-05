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
  guardando = false;
  usuario: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario?.area) {
      this.error = 'No se pudo identificar el área del usuario.';
      this.cargando = false;
      return;
    }

    this.cargarArea();
  }

  cargarArea(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    const areaUrl = encodeURIComponent(this.usuario.area);
    const url = `http://localhost:5000/api/areas/pendiente/${areaUrl}`;

    this.http.get<any>(url).subscribe({
      next: (res: any) => {
        this.area = res;

        this.form = {
          responsable: res.responsable || this.usuario?.nombres || this.usuario?.usuario || '',
          detalle: res.detalle || '',
          observacion: res.observacion || ''
        };

        this.cargando = false;
      },
      error: (err: any) => {
        this.area = null;
        this.error = err.error?.mensaje || 'No hay solicitudes pendientes para esta área.';
        this.cargando = false;
      }
    });
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'COMPLETADO': return 'Completado';
      case 'NEGADO': return 'Negado';
      default: return estado || 'Sin estado';
    }
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.area?.id) {
      this.error = 'No hay una solicitud de área seleccionada.';
      return;
    }

    if (!this.form.responsable.trim() || !this.form.detalle.trim()) {
      this.error = 'Responsable y detalle son obligatorios.';
      return;
    }

    this.guardando = true;

    const body = {
      responsable: this.form.responsable.trim(),
      detalle: this.form.detalle.trim(),
      observacion: this.form.observacion.trim(),
      usuario: this.usuario?.usuario || 'area',
      rol: this.usuario?.rol || 'area'
    };

    const url = `http://localhost:5000/api/areas/formulario/${this.area.id}`;

    this.http.put<any>(url, body).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Validación guardada correctamente.';
        this.guardando = false;
        this.cargarArea();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar formulario del área.';
        this.guardando = false;
      }
    });
  }
}