import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentoFirmado {
  id?: number;
  solicitud_id?: number;
  nombre_archivo?: string;
  ruta_archivo?: string;
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observacion?: string;
  fecha_subida?: string;
  nombres?: string;
  apellidos?: string;
  usuario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private readonly API_URL = 'http://localhost:5000/api/documentos';

  constructor(private http: HttpClient) {}

  subirDocumento(solicitudId: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('solicitud_id', solicitudId.toString());
    formData.append('archivo', archivo);

    return this.http.post<any>(`${this.API_URL}/subir`, formData);
  }

  listarDocumentos(): Observable<DocumentoFirmado[]> {
    return this.http.get<DocumentoFirmado[]>(this.API_URL);
  }

  obtenerDocumento(id: number): Observable<DocumentoFirmado> {
    return this.http.get<DocumentoFirmado>(`${this.API_URL}/${id}`);
  }

  aprobarDocumento(id: number): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}/aprobar`, {});
  }

  rechazarDocumento(id: number, observacion: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}/rechazar`, { observacion });
  }

  descargarDocumento(id: number): string {
    return `${this.API_URL}/${id}/descargar`;
  }
}