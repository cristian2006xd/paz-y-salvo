import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditoriaRegistro {
  id: number;
  usuario: string;
  rol: string;
  modulo: string;
  accion: string;
  detalle: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private readonly API_URL = 'http://localhost:5000/api/auditoria';

  constructor(private http: HttpClient) {}

  listar(): Observable<AuditoriaRegistro[]> {
    return this.http.get<AuditoriaRegistro[]>(this.API_URL);
  }
}