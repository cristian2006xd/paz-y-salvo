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

  // =========================
  // LISTAR TODAS
  // =========================
  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/solicitudes`);
  }

  // =========================
  // CREAR SOLICITUD
  // =========================
  crear(data: Solicitud): Observable<any> {
    return this.http.post(`${this.API_URL}/solicitudes`, data);
  }

  // =========================
  // SOLICITUD EX FUNCIONARIO
  // =========================
  obtenerSolicitudExFuncionario(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/ex-funcionario/${id}/solicitud`);
  }

  // =========================
  // LISTAR EX FUNCIONARIOS
  // =========================
  listarExFuncionarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/ex-funcionarios`);
  }

  // =========================
  // DETALLE SOLICITUD
  // =========================
  obtenerDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/solicitudes/${id}`);
  }

  // =========================
  // CAMBIAR ESTADO
  // =========================
  cambiarEstado(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/solicitudes/${id}/estado`, data);
  }

  // =========================
  // 🔥 DESCARGAR PDF (FIX ERROR)
  // =========================
  descargarPdf(id: number): string {
    return `${this.API_URL}/solicitudes/${id}/pdf`;
  }

}