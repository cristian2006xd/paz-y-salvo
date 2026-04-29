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
  observacion = '';

  cargando = true;
  mensaje = '';
  error = '';

  constructor(private documentosService: DocumentosService) {}

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  cargarDocumentos(): void {
    this.cargando = true;

    this.documentosService.listarDocumentos().subscribe({
      next: (data) => {
        this.documentos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar documentos.';
        this.cargando = false;
      }
    });
  }

  aprobar(doc: any): void {
    this.mensaje = '';
    this.error = '';

    this.documentosService.aprobarDocumento(doc.id).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Documento aprobado.';
        this.cargarDocumentos();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al aprobar documento.';
      }
    });
  }

  rechazar(doc: any): void {
    this.mensaje = '';
    this.error = '';

    const motivo = prompt('Ingrese la observación del rechazo:');

    if (!motivo) {
      this.error = 'La observación es obligatoria para rechazar.';
      return;
    }

    this.documentosService.rechazarDocumento(doc.id, motivo).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Documento rechazado.';
        this.cargarDocumentos();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al rechazar documento.';
      }
    });
  }
}