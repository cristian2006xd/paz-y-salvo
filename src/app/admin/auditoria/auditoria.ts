import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  cargando = true;
  error = '';

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarAuditoria();
  }

  cargarAuditoria(): void {
    this.cargando = true;
    this.error = '';

    this.auditoriaService.listar().subscribe({
      next: (data) => {
        this.registros = data;
        this.filtrados = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar auditoría.';
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    const texto = this.search.toLowerCase().trim();

    this.filtrados = this.registros.filter(r =>
      r.usuario?.toLowerCase().includes(texto) ||
      r.rol?.toLowerCase().includes(texto) ||
      r.modulo?.toLowerCase().includes(texto) ||
      r.accion?.toLowerCase().includes(texto) ||
      r.detalle?.toLowerCase().includes(texto)
    );
  }

  limpiarBusqueda(): void {
    this.search = '';
    this.filtrados = this.registros;
  }
}