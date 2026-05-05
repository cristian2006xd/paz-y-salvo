import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-th-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  solicitudes: any[] = [];

  stats = {
    total: 0,
    pendientes: 0,
    proceso: 0,
    aprobadas: 0
  };

  cargando = true;
  error = '';

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.error = '';

    this.solicitudesService.listar().subscribe({
      next: (data: any[]) => {
        this.solicitudes = data || [];
        this.calcularStats();
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar solicitudes.';
        this.cargando = false;
      }
    });
  }

  calcularStats(): void {
    this.stats.total = this.solicitudes.length;

    this.stats.pendientes = this.solicitudes.filter(s =>
      s.estado === 'PENDIENTE'
    ).length;

    this.stats.proceso = this.solicitudes.filter(s =>
      s.estado === 'EN_PROCESO' || s.estado === 'EN_REVISION'
    ).length;

    this.stats.aprobadas = this.solicitudes.filter(s =>
      s.estado === 'APROBADO' || s.estado === 'FINALIZADO'
    ).length;
  }
}