import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudesService } from '../../services/solicitudes';

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

  nuevaSolicitud: any = {
    ex_funcionario_id: '',
    creado_por: ''
  };

  errores: any = {};
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
  }

  soloLetrasCreadoPor(): void {
    this.nuevaSolicitud.creado_por = String(this.nuevaSolicitud.creado_por || '')
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
      .slice(0, 60);

    this.validarSolicitud();
  }

  validarSolicitud(): boolean {
    this.errores = {};

    if (!this.nuevaSolicitud.ex_funcionario_id) {
      this.errores.ex_funcionario_id = 'Seleccione un ex funcionario.';
    }

    const creadoPor = String(this.nuevaSolicitud.creado_por || '').trim();

    if (!creadoPor) {
      this.errores.creado_por = 'Ingrese el nombre del encargado.';
    } else if (creadoPor.length < 3) {
      this.errores.creado_por = 'Mínimo 3 caracteres.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(creadoPor)) {
      this.errores.creado_por = 'Solo se permiten letras.';
    }

    return Object.keys(this.errores).length === 0;
  }

  cargarDatosIniciales(): void {
    this.cargandoDatos = true;
    this.error = '';

    let pendientes = 2;

    const finalizar = () => {
      pendientes--;
      if (pendientes === 0) this.cargandoDatos = false;
    };

    this.solicitudesService.listarExFuncionarios().subscribe({
      next: (data: any[]) => {
        this.exFuncionarios = data || [];
        finalizar();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar ex funcionarios.';
        finalizar();
      }
    });

    this.solicitudesService.listar().subscribe({
      next: (data: any[]) => {
        this.solicitudes = data || [];
        finalizar();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar solicitudes.';
        finalizar();
      }
    });
  }

  crearSolicitud(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.validarSolicitud()) {
      this.error = 'Complete correctamente todos los campos.';
      return;
    }

    this.cargando = true;

    const payload: any = {
      ex_funcionario_id: Number(this.nuevaSolicitud.ex_funcionario_id),
      creado_por: String(this.nuevaSolicitud.creado_por).trim()
    };

    this.solicitudesService.crear(payload).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Solicitud creada correctamente.';
        this.cargando = false;

        this.nuevaSolicitud = {
          ex_funcionario_id: '',
          creado_por: ''
        };

        this.errores = {};
        this.cargarSolicitudes();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al crear la solicitud.';
        this.cargando = false;
      }
    });
  }

  cargarSolicitudes(): void {
    this.solicitudesService.listar().subscribe({
      next: (data: any[]) => {
        this.solicitudes = data || [];
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar solicitudes.';
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