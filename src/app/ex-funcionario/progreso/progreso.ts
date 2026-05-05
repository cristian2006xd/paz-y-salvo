import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progreso.html',
  styleUrl: './progreso.css'
})
export class Progreso implements OnInit {

  usuario: any = null;
  solicitud: any = null;
  areas: any[] = [];

  cargando = true;
  error = '';

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario?.id) {
      this.error = 'No se pudo identificar al usuario.';
      this.cargando = false;
      return;
    }

    this.cargarProgreso();
  }

  cargarProgreso(): void {
    this.cargando = true;
    this.error = '';

    this.solicitudesService.obtenerSolicitudExFuncionario(Number(this.usuario.id))
      .subscribe({
        next: (res: any) => {
          this.solicitud = res.solicitud;
          this.areas = res.areas || [];
          this.cargando = false;
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'No existe solicitud activa.';
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
      case 'FINALIZADO': return 'Finalizado';
      case 'COMPLETADO': return 'Completado';
      case 'NEGADO': return 'Negado';
      default: return estado || 'Sin estado';
    }
  }

  completadas(): number {
    return this.areas.filter(a => a.estado === 'COMPLETADO').length;
  }

  porcentaje(): number {
    if (!this.areas.length) return 0;
    return Math.round((this.completadas() / this.areas.length) * 100);
  }
}