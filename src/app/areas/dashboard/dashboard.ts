import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AreasService } from '../../services/areas';

@Component({
  selector: 'app-area-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  areas: any[] = [];
  cargando = false;
  procesando = false;
  mensaje = '';
  error = '';
  usuario: any = null;

  constructor(
    private areasService: AreasService,
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario?.area) {
      this.error = 'Este usuario no tiene área asignada.';
      return;
    }

    this.cargarPendientePorArea();
  }

  cargarPendientePorArea(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    const area = encodeURIComponent(this.usuario.area);

    this.http.get<any>(`http://localhost:5000/api/areas/pendiente/${area}`)
      .subscribe({
        next: (data: any) => {
          this.areas = data ? [data] : [];
          this.cargando = false;
        },
        error: () => {
          this.areas = [];
          this.mensaje = 'No existen solicitudes pendientes para esta área.';
          this.cargando = false;
        }
      });
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'COMPLETADO': return 'Completado';
      case 'NEGADO': return 'Negado';
      default: return estado || 'Sin estado';
    }
  }

  completar(area: any): void {
    this.mensaje = '';
    this.error = '';

    if (!area?.id) {
      this.error = 'No se encontró el registro del área.';
      return;
    }

    this.procesando = true;

    const body = {
      estado: 'COMPLETADO' as const,
      comentario: area.comentario?.trim() || 'Validado correctamente',
      responsable: this.usuario?.usuario || this.usuario?.nombres || 'Área'
    };

    this.areasService.actualizarArea(area.id, body).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Área completada correctamente.';
        this.procesando = false;
        this.cargarPendientePorArea();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al completar el área.';
        this.procesando = false;
      }
    });
  }

  volver(): void {
    this.location.back();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}