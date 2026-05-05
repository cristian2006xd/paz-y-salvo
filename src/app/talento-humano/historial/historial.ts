import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {

  solicitudes: any[] = [];
  cargando = true;
  error = '';

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';

    this.solicitudesService.listar().subscribe({
      next: (data: any[]) => {
        this.solicitudes = data || [];
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar historial.';
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
      case 'NEGADO': return 'Negado';
      default: return estado || 'Sin estado';
    }
  }

  claseEstado(estado: string): string {
    return estado || 'PENDIENTE';
  }
}