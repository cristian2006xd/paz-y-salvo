import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    return this.http.post(`${this.API_URL}/subir`, formData);
  }

  listarDocumentos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  aprobarDocumento(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/aprobar`, {});
  }

  rechazarDocumento(id: number, observacion: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/rechazar`, { observacion });
  }
}