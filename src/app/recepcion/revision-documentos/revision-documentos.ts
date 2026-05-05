import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentosService } from '../../services/documentos';

@Component({
  selector: 'app-revision-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revision-documentos.html',
  styleUrl: './revision-documentos.css'
})
export class RevisionDocumentos implements OnInit {

  documentos: any[] = [];
  documentoSeleccionado: any = null;

  observacion = '';
  cargando = true;
  procesando = false;
  mensaje = '';
  error = '';

  constructor(private documentosService: DocumentosService) {}

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  cargarDocumentos(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.documentosService.listarDocumentos().subscribe({
      next: (res: any[]) => {
        this.documentos = res || [];
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar documentos.';
        this.cargando = false;
      }
    });
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'APROBADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
      case 'FINALIZADO': return 'Finalizado';
      default: return estado || 'Sin estado';
    }
  }

  estadoClase(estado: string): string {
    if (estado === 'APROBADO') return 'aprobado';
    if (estado === 'RECHAZADO') return 'rechazado';
    return 'pendiente';
  }

  seleccionar(doc: any): void {
    this.documentoSeleccionado = doc;
    this.observacion = doc.observacion || '';
    this.mensaje = '';
    this.error = '';
  }

  descargar(doc: any): void {
    if (!doc?.id) {
      this.error = 'No se encontró el documento.';
      return;
    }

    const url = this.documentosService.descargarDocumento(doc.id);
    window.open(url, '_blank');
  }

  aprobar(doc: any): void {
    if (!doc?.id) return;

    this.procesando = true;
    this.error = '';
    this.mensaje = '';

    this.documentosService.aprobarDocumento(doc.id).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Documento aprobado y proceso finalizado.';
        this.procesando = false;
        this.documentoSeleccionado = null;
        this.cargarDocumentos();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al aprobar documento.';
        this.procesando = false;
      }
    });
  }

  rechazar(doc: any): void {
    if (!doc?.id) return;

    if (!this.observacion.trim()) {
      this.error = 'La observación es obligatoria para rechazar.';
      return;
    }

    this.procesando = true;
    this.error = '';
    this.mensaje = '';

    this.documentosService.rechazarDocumento(doc.id, this.observacion.trim()).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Documento rechazado correctamente.';
        this.procesando = false;
        this.documentoSeleccionado = null;
        this.observacion = '';
        this.cargarDocumentos();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al rechazar documento.';
        this.procesando = false;
      }
    });
  }
}