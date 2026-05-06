import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css'
})
export class SolicitudesAdmin implements OnInit {

  solicitudes: any[] = [];
  filtradas: any[] = [];

  search = '';
  filtroEstado = '';
  cargando = true;
  error = '';

  constructor(
    private solicitudesService: SolicitudesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  // 🔥 BOTÓN VOLVER
  irDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';

    this.solicitudesService.listar().subscribe({
      next: (data: any[]) => {
        this.solicitudes = data || [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar solicitudes.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const texto = this.search.toLowerCase().trim();

    this.filtradas = this.solicitudes.filter(s => {
      const coincideTexto =
        !texto ||
        s.nombres?.toLowerCase().includes(texto) ||
        s.apellidos?.toLowerCase().includes(texto) ||
        s.usuario?.toLowerCase().includes(texto) ||
        s.area?.toLowerCase().includes(texto) ||
        s.estado?.toLowerCase().includes(texto);

      const coincideEstado =
        !this.filtroEstado || s.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  limpiar(): void {
    this.search = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_PROCESO': return 'En proceso';
      case 'EN_REVISION': return 'En revisión';
      case 'APROBADO': return 'Aprobado';
      case 'NEGADO': return 'Negado';
      case 'FINALIZADO': return 'Finalizado';
      default: return estado || 'Sin estado';
    }
  }

  estadosUnicos(): string[] {
    return [...new Set(this.solicitudes.map(s => s.estado).filter(Boolean))];
  }
}