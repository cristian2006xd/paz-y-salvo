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

    if (!id) {
      this.error = 'ID de solicitud inválido.';
      this.cargando = false;
      return;
    }

    this.cargarDetalle(id);
  }

  cargarDetalle(id: number): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.solicitudesService.obtenerDetalle(id).subscribe({
      next: (res: any) => {
        this.solicitud = res.solicitud;
        this.areas = res.areas || [];
        this.observacion = this.solicitud?.observacion || '';
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar detalle.';
        this.cargando = false;
      }
    });
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_PROCESO': return 'En proceso';
      case 'EN_REVISION': return 'En revisión';
      case 'APROBADO': return 'Aprobado';
      case 'NEGADO': return 'Negado';
      case 'FINALIZADO': return 'Finalizado';
      case 'COMPLETADO': return 'Completado';
      default: return estado || 'Sin estado';
    }
  }

  estadoClase(estado: string): string {
    if (estado === 'APROBADO' || estado === 'FINALIZADO' || estado === 'COMPLETADO') return 'ok';
    if (estado === 'NEGADO') return 'bad';
    if (estado === 'EN_REVISION') return 'review';
    return 'pending';
  }

  aprobar(): void {
    if (!this.todasCompletadas()) {
      this.error = 'No se puede aprobar hasta que todas las áreas estén completadas.';
      return;
    }

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
    if (!this.solicitud?.id) return;

    this.mensaje = '';
    this.error = '';
    this.guardando = true;

    this.solicitudesService.cambiarEstado(this.solicitud.id, {
      estado,
      observacion: this.observacion.trim(),
      usuario: this.usuarioActual?.usuario || 'admin',
      rol: this.usuarioActual?.rol || 'admin'
    }).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Estado actualizado correctamente.';
        this.guardando = false;
        this.cargarDetalle(this.solicitud.id);
      },
      error: (err: any) => {
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