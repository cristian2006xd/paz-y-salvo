import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  resumen: any = null;
  fechaActual = new Date();

  cargando = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando = true;
    this.error = '';
    this.fechaActual = new Date();

    this.http.get<any>('http://localhost:5000/api/reportes/resumen').subscribe({
      next: (data: any) => {
        this.resumen = data;
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar reportes.';
        this.cargando = false;
      }
    });
  }

  porcentajeAprobadas(): number {
    if (!this.resumen?.solicitudes) return 0;
    return Math.round((this.resumen.aprobadas / this.resumen.solicitudes) * 100);
  }

  imprimir(): void {
    window.print();
  }
}