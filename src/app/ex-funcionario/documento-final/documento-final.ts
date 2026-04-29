import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    private documentosService: DocumentosService
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;

    if (this.usuario?.id) {
      this.cargarSolicitud();
    } else {
      this.error = 'No se pudo identificar al usuario.';
      this.cargando = false;
    }
  }

  cargarSolicitud(): void {
    this.solicitudesService.obtenerSolicitudExFuncionario(this.usuario.id).subscribe({
      next: (res) => {
        this.solicitud = res.solicitud;
        this.areas = res.areas;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No existe solicitud activa.';
        this.cargando = false;
      }
    });
  }

  puedeDescargar(): boolean {
    return this.solicitud?.estado === 'APROBADO';
  }

  imprimirPDF(): void {
    window.print();
  }

  seleccionarArchivo(event: any): void {
    const archivo = event.target.files[0];

    if (!archivo) return;

    if (archivo.type !== 'application/pdf') {
      this.error = 'Solo se permite subir archivos PDF.';
      this.archivoSeleccionado = null;
      return;
    }

    this.error = '';
    this.archivoSeleccionado = archivo;
  }

  subirDocumentoFirmado(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.puedeDescargar()) {
      this.error = 'La solicitud aún no está aprobada.';
      return;
    }

    if (!this.archivoSeleccionado) {
      this.error = 'Seleccione el documento firmado en PDF.';
      return;
    }

    this.subiendo = true;

    this.documentosService.subirDocumento(this.solicitud.id, this.archivoSeleccionado).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Documento subido correctamente.';
        this.subiendo = false;
        this.archivoSeleccionado = null;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al subir documento.';
        this.subiendo = false;
      }
    });
  }
}