import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recepcion-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  stats = {
    pendientes: 0,
    revisados: 0,
    aprobados: 0
  };

  cargando = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarStats();
  }

  cargarStats(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<any>('http://localhost:5000/api/documentos/stats')
      .subscribe({
        next: (res: any) => {
          this.stats = {
            pendientes: res.pendientes || 0,
            revisados: res.revisados || 0,
            aprobados: res.aprobados || 0
          };
          this.cargando = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar las estadísticas.';
          this.cargando = false;
        }
      });
  }
}