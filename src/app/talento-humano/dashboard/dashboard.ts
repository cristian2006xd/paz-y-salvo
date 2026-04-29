import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-th-dashboard',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.solicitudesService.listar().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.calcularStats();
      }
    });
  }

  calcularStats(): void {
    this.stats.total = this.solicitudes.length;
    this.stats.pendientes = this.solicitudes.filter(s => s.estado === 'PENDIENTE').length;
    this.stats.proceso = this.solicitudes.filter(s => s.estado === 'EN_PROCESO').length;
    this.stats.aprobadas = this.solicitudes.filter(s => s.estado === 'APROBADO').length;
  }
}