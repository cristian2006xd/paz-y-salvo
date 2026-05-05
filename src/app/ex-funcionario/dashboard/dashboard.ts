import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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

  constructor(
    private solicitudesService: SolicitudesService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarSolicitud();
  }

  obtenerUsuario(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;
  }

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

  estadoAreaClase(estado: string): string {
    if (estado === 'COMPLETADO') return 'completado';
    if (estado === 'NEGADO') return 'negado';
    return 'pendiente';
  }

  iconoArea(estado: string): string {
    if (estado === 'COMPLETADO') return '✔';
    if (estado === 'NEGADO') return '✖';
    return '⏳';
  }

  puedeVerDocumento(): boolean {
    return this.solicitud?.estado === 'APROBADO' || this.solicitud?.estado === 'FINALIZADO';
  }

  descargarPDF(): void {
    if (!this.solicitud?.id || !this.puedeVerDocumento()) return;

    const url = `http://localhost:5000/api/solicitudes/${this.solicitud.id}/pdf`;
    window.open(url, '_blank');
  }

  volver(): void {
    this.location.back();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}