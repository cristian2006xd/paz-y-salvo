import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditoriaService, AuditoriaRegistro } from '../../services/auditoria';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css'
})
export class Auditoria implements OnInit {
  registros: AuditoriaRegistro[] = [];
  filtrados: AuditoriaRegistro[] = [];

  search = '';
  filtroRol = '';
  filtroModulo = '';

  cargando = true;
  error = '';

  constructor(
    private auditoriaService: AuditoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAuditoria();
  }

  irDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  cargarAuditoria(): void {
    this.cargando = true;
    this.error = '';

    this.auditoriaService.listar().subscribe({
      next: (data) => {
        this.registros = data || [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar auditoría.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const texto = this.search.toLowerCase().trim();

    this.filtrados = this.registros.filter(r => {
      const coincideTexto =
        !texto ||
        r.usuario?.toLowerCase().includes(texto) ||
        r.rol?.toLowerCase().includes(texto) ||
        r.modulo?.toLowerCase().includes(texto) ||
        r.accion?.toLowerCase().includes(texto) ||
        r.detalle?.toLowerCase().includes(texto);

      const coincideRol = !this.filtroRol || r.rol === this.filtroRol;
      const coincideModulo = !this.filtroModulo || r.modulo === this.filtroModulo;

      return coincideTexto && coincideRol && coincideModulo;
    });
  }

  limpiarBusqueda(): void {
    this.search = '';
    this.filtroRol = '';
    this.filtroModulo = '';
    this.aplicarFiltros();
  }

  rolesUnicos(): string[] {
    return [...new Set(this.registros.map(r => r.rol).filter(Boolean))];
  }

  modulosUnicos(): string[] {
    return [...new Set(this.registros.map(r => r.modulo).filter(Boolean))];
  }
}