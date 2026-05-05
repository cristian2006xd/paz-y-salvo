import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes';
import { DocumentosService } from '../../services/documentos';

@Component({
  selector: 'app-documento-final',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documento-final.html',
  styleUrl: './documento-final.css'
})
export class DocumentoFinal implements OnInit {

  usuario: any = null;
  solicitud: any = null;
  areas: any[] = [];

  archivoSeleccionado: File | null = null;

  cargando = true;
  subiendo = false;
  mensaje = '';
  error = '';

  constructor(
    private solicitudesService: SolicitudesService,
    private documentosService: DocumentosService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (!this.usuario?.id) {
      this.error = 'No se pudo identificar al usuario.';
      this.cargando = false;
      return;
    }

    this.cargarSolicitud();
  }

  cargarSolicitud(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.solicitudesService.obtenerSolicitudExFuncionario(Number(this.usuario.id))
      .subscribe({
        next: (res: any) => {
          this.solicitud = res.solicitud;
          this.areas = res.areas || [];
          this.cargando = false;
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'No existe solicitud activa.';
          this.cargando = false;
        }
      });
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_PROCESO': return 'En proceso';
      case 'EN_REVISION': return 'En revisión';
      case 'APROBADO': return 'Aprobado';
      case 'NEGADO': return 'Negado';
      case 'RECHAZADO': return 'Rechazado';
      case 'FINALIZADO': return 'Finalizado';
      case 'COMPLETADO': return 'Completado';
      default: return estado || 'Sin estado';
    }
  }

  yaFinalizado(): boolean {
    return this.solicitud?.estado === 'FINALIZADO';
  }

  puedeDescargar(): boolean {
    return this.solicitud?.estado === 'APROBADO' || this.yaFinalizado();
  }

  puedeSubir(): boolean {
    return this.solicitud?.estado === 'APROBADO' && !this.yaFinalizado();
  }

  porcentaje(): number {
    if (!this.areas.length) return 0;

    const completadas = this.areas.filter(a => a.estado === 'COMPLETADO').length;
    return Math.round((completadas / this.areas.length) * 100);
  }

  descargarPDFBackend(): void {
    if (!this.puedeDescargar()) {
      this.error = 'El PDF solo se puede descargar cuando la solicitud esté APROBADA.';
      return;
    }

    const url = this.solicitudesService.descargarPdf(this.solicitud.id);
    window.open(url, '_blank');
  }

  imprimirPDF(): void {
    if (!this.puedeDescargar()) {
      this.error = 'El documento solo se puede imprimir cuando la solicitud esté APROBADA.';
      return;
    }

    window.print();
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) return;

    if (!this.puedeSubir()) {
      this.error = 'No se puede subir documento porque el proceso no está disponible.';
      input.value = '';
      return;
    }

    if (archivo.type !== 'application/pdf') {
      this.error = 'Solo se permite subir archivos PDF.';
      this.archivoSeleccionado = null;
      input.value = '';
      return;
    }

    this.error = '';
    this.mensaje = '';
    this.archivoSeleccionado = archivo;
  }

  subirDocumentoFirmado(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.puedeSubir()) {
      this.error = 'El documento solo se puede subir cuando la solicitud esté APROBADA.';
      return;
    }

    if (!this.archivoSeleccionado) {
      this.error = 'Seleccione el documento firmado en PDF.';
      return;
    }

    this.subiendo = true;

    this.documentosService.subirDocumento(this.solicitud.id, this.archivoSeleccionado)
      .subscribe({
        next: (res: any) => {
          this.mensaje = res.mensaje || 'Documento firmado subido correctamente.';
          this.subiendo = false;
          this.archivoSeleccionado = null;
        },
        error: (err: any) => {
          this.error = err.error?.mensaje || 'Error al subir documento.';
          this.subiendo = false;
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