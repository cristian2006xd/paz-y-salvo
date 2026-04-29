import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AreaSolicitud {
  id?: number;
  solicitud_id: number;
  area: string;
  estado?: 'PENDIENTE' | 'COMPLETADO';
  comentario?: string;
  responsable?: string;
  detalle?: string;
  observacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  obtenerPorSolicitud(id: number): Observable<AreaSolicitud[]> {
    return this.http.get<AreaSolicitud[]>(`${this.API_URL}/solicitudes/${id}/areas`);
  }

  actualizarArea(id: number, data: Partial<AreaSolicitud>): Observable<any> {
    return this.http.put(`${this.API_URL}/areas/${id}`, data);
  }

  obtenerPendientePorArea(area: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/areas/pendiente/${area}`);
  }

  guardarFormularioArea(id: number, data: Partial<AreaSolicitud>): Observable<any> {
    return this.http.put(`${this.API_URL}/areas/formulario/${id}`, data);
  }
}