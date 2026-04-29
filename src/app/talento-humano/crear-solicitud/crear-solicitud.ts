import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudesService, Solicitud } from '../../services/solicitudes';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-solicitud.html',
  styleUrl: './crear-solicitud.css'
})
export class CrearSolicitud implements OnInit {

  exFuncionarios: any[] = [];
  solicitudes: any[] = [];

  nuevaSolicitud: Solicitud = {
    ex_funcionario_id: 0,
    creado_por: 0
  };

  usuarioActual: any = null;

  mensaje = '';
  error = '';
  cargando = false;
  cargandoDatos = false;

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.cargarDatosIniciales();
  }

  obtenerUsuarioActual(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    this.usuarioActual = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    if (this.usuarioActual?.id) {
      this.nuevaSolicitud.creado_por = Number(this.usuarioActual.id);
    }
  }

  cargarDatosIniciales(): void {
    this.cargandoDatos = true;
    this.error = '';

    this.cargarExFuncionarios();
    this.cargarSolicitudes();

    this.cargandoDatos = false;
  }

  cargarExFuncionarios(): void {
    this.solicitudesService.listarExFuncionarios().subscribe({
      next: (data) => {
        this.exFuncionarios = data;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar ex funcionarios.';
      }
    });
  }

  cargarSolicitudes(): void {
    this.solicitudesService.listar().subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar solicitudes.';
      }
    });
  }

  crearSolicitud(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.nuevaSolicitud.ex_funcionario_id || Number(this.nuevaSolicitud.ex_funcionario_id) <= 0) {
      this.error = 'Seleccione un ex funcionario.';
      return;
    }

    if (!this.nuevaSolicitud.creado_por || Number(this.nuevaSolicitud.creado_por) <= 0) {
      this.error = 'No se pudo identificar el usuario creador.';
      return;
    }

    this.cargando = true;

    const payload: Solicitud = {
      ex_funcionario_id: Number(this.nuevaSolicitud.ex_funcionario_id),
      creado_por: Number(this.nuevaSolicitud.creado_por)
    };

    this.solicitudesService.crear(payload).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Solicitud creada correctamente.';
        this.cargando = false;
        this.nuevaSolicitud.ex_funcionario_id = 0;
        this.cargarSolicitudes();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al crear la solicitud.';
        this.cargando = false;
      }
    });
  }

  claseEstado(estado: string): string {
    return estado || 'PENDIENTE';
  }
}