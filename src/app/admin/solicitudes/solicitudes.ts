import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router'; // 🔥 IMPORTANTE

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // 🔥 IMPORTANTE
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css'
})
export class SolicitudesAdmin implements OnInit {

  solicitudes: any[] = [];
  filtradas: any[] = [];

  search = '';
  cargando = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;

    this.http.get<any[]>('http://localhost:5000/api/solicitudes')
      .subscribe({
        next: (data) => {
          this.solicitudes = data;
          this.filtradas = data;
          this.cargando = false;
        },
        error: () => {
          this.error = 'Error al cargar solicitudes';
          this.cargando = false;
        }
      });
  }

  buscar(): void {
    const texto = this.search.toLowerCase();

    this.filtradas = this.solicitudes.filter(s =>
      s.nombres?.toLowerCase().includes(texto) ||
      s.apellidos?.toLowerCase().includes(texto) ||
      s.usuario?.toLowerCase().includes(texto) ||
      s.estado?.toLowerCase().includes(texto)
    );
  }
}