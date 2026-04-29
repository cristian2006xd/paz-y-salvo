import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginData {
  usuario: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data);
  }

  guardarSesion(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('rol', res.usuario.rol);
    localStorage.setItem('usuario', JSON.stringify(res.usuario));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getUsuario();
  }

  logout(): void {
    localStorage.clear();
  }
}