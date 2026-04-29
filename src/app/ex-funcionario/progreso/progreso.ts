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

    if (this.usuario?.id) {
      this.cargarProgreso();
    } else {
      this.error = 'No se pudo identificar al usuario.';
      this.cargando = false;
    }
  }

  cargarProgreso(): void {
    this.solicitudesService.obtenerSolicitudExFuncionario(this.usuario.id).subscribe({
      next: (res) => {
        this.solicitud = res.solicitud;
        this.areas = res.areas;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No existe solicitud activa.';
        this.cargando = false;
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
}