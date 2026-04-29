import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  usuario: string;
  password?: string;
  rol: 'admin' | 'talento_humano' | 'ex_funcionario' | 'area' | 'recepcion';
  area?: string;
  estado?: 'ACTIVO' | 'INHABILITADO';
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly API_URL = 'http://localhost:5000/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  crear(usuario: Usuario): Observable<any> {
    return this.http.post(this.API_URL, usuario);
  }
}