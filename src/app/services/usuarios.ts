import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  usuario: string;
  password?: string;
  rol: string;
  area?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:5000/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crear(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  desactivar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, {
      estado: 'INHABILITADO'
    });
  }

  activar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, {
      estado: 'ACTIVO'
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}