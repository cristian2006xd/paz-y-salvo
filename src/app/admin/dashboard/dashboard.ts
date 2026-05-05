import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { SolicitudesService } from '../../services/solicitudes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  usuario: any = null;

  solicitudes: any[] = [];
  usuarios: any[] = [];

  cargando = true;
  error = '';

  constructor(
    private authService: AuthService,
    private solicitudesService: SolicitudesService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.solicitudesService.listar().subscribe({
      next: (solicitudes: any[]) => {
        this.solicitudes = solicitudes || [];

        this.http.get<any[]>('http://localhost:5000/api/usuarios').subscribe({
          next: (usuarios: any[]) => {
            this.usuarios = usuarios || [];
            this.cargando = false;
          },
          error: () => {
            this.usuarios = [];
            this.cargando = false;
          }
        });
      },
      error: () => {
        this.error = 'No se pudieron cargar los datos del dashboard.';
        this.cargando = false;
      }
    });
  }

  totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  pendientes(): number {
    return this.solicitudes.filter(s =>
      s.estado !== 'APROBADO' && s.estado !== 'FINALIZADO'
    ).length;
  }

  aprobadas(): number {
    return this.solicitudes.filter(s =>
      s.estado === 'APROBADO' || s.estado === 'FINALIZADO'
    ).length;
  }

  usuariosActivos(): number {
    return this.usuarios.filter(u => u.estado === 'ACTIVO').length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}