import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Solicitud {
  id?: number;
  ex_funcionario_id: number;
  creado_por: number;
  estado?: 'PENDIENTE' | 'EN_PROCESO' | 'EN_REVISION' | 'APROBADO' | 'NEGADO';
  observacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/solicitudes`);
  }

  crear(data: Solicitud): Observable<any> {
    return this.http.post(`${this.API_URL}/solicitudes`, data);
  }

  obtenerSolicitudExFuncionario(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ex-funcionario/${id}/solicitud`);
  }

  listarExFuncionarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/ex-funcionarios`);
  }

  obtenerDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/solicitudes/${id}`);
  }

  cambiarEstado(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/solicitudes/${id}/estado`, data);
  }
}