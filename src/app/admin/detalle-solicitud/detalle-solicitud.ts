import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './detalle-solicitud.html',
  styleUrl: './detalle-solicitud.css'
})
export class DetalleSolicitud implements OnInit {

  solicitud: any = null;
  areas: any[] = [];
  usuarioActual: any = null;

  observacion = '';

  cargando = true;
  guardando = false;
  mensaje = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private solicitudesService: SolicitudesService
  ) {}

  ngOnInit(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    this.usuarioActual = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDetalle(id);
  }

  cargarDetalle(id: number): void {
    this.cargando = true;

    this.solicitudesService.obtenerDetalle(id).subscribe({
      next: (res) => {
        this.solicitud = res.solicitud;
        this.areas = res.areas || [];
        this.observacion = this.solicitud.observacion || '';
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar detalle.';
        this.cargando = false;
      }
    });
  }

  aprobar(): void {
    this.cambiarEstado('APROBADO');
  }

  negar(): void {
    if (!this.observacion.trim()) {
      this.error = 'Para negar la solicitud debe ingresar una observación.';
      return;
    }

    this.cambiarEstado('NEGADO');
  }

  enviarRevision(): void {
    this.cambiarEstado('EN_REVISION');
  }

  cambiarEstado(estado: string): void {
    this.mensaje = '';
    this.error = '';
    this.guardando = true;

    this.solicitudesService.cambiarEstado(this.solicitud.id, {
      estado,
      observacion: this.observacion,
      usuario: this.usuarioActual?.usuario,
      rol: this.usuarioActual?.rol
    }).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje;
        this.guardando = false;
        this.cargarDetalle(this.solicitud.id);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al actualizar estado.';
        this.guardando = false;
      }
    });
  }

  completadas(): number {
    return this.areas.filter(a => a.estado === 'COMPLETADO').length;
  }

  porcentaje(): number {
    if (this.areas.length === 0) return 0;
    return Math.round((this.completadas() / this.areas.length) * 100);
  }

  todasCompletadas(): boolean {
    return this.areas.length > 0 && this.completadas() === this.areas.length;
  }
}