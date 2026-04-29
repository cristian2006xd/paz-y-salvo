import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-ex-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  usuario: any = null;
  solicitud: any = null;
  areas: any[] = [];

  cargando = true;
  error = '';

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarSolicitud();
  }

  // =========================
  // USUARIO
  // =========================
  obtenerUsuario(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;
  }

  // =========================
  // SOLICITUD
  // =========================
  cargarSolicitud(): void {
    if (!this.usuario?.id) {
      this.error = 'No se encontró el usuario en la sesión.';
      this.cargando = false;
      return;
    }

    this.cargando = true;
    this.error = '';

    this.solicitudesService
      .obtenerSolicitudExFuncionario(Number(this.usuario.id))
      .subscribe({
        next: (res: any) => {
          this.solicitud = res.solicitud;
          this.areas = res.areas || [];
          this.cargando = false;
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'No se pudo cargar la solicitud.';
          this.cargando = false;
        }
      });
  }

  // =========================
  // MÉTRICAS
  // =========================
  totalAreas(): number {
    return this.areas.length;
  }

  areasCompletadas(): number {
    return this.areas.filter(a => a.estado === 'COMPLETADO').length;
  }

  porcentaje(): number {
    if (this.totalAreas() === 0) return 0;
    return Math.round((this.areasCompletadas() / this.totalAreas()) * 100);
  }

  // =========================
  // VALIDACIONES UI
  // =========================
  puedeVerDocumento(): boolean {
    return this.solicitud?.estado === 'APROBADO';
  }
}