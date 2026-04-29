import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../services/usuarios';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];

  nuevo: Usuario = {
    nombres: '',
    apellidos: '',
    usuario: '',
    password: '',
    rol: 'admin',
    area: ''
  };

  cargando = false;
  mensaje = '';
  error = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.mensaje = '';
    this.error = '';

    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar usuarios.';
      }
    });
  }

  crearUsuario(): void {
    this.mensaje = '';
    this.error = '';

    if (
      !this.nuevo.nombres.trim() ||
      !this.nuevo.apellidos.trim() ||
      !this.nuevo.usuario.trim() ||
      !this.nuevo.password?.trim() ||
      !this.nuevo.rol
    ) {
      this.error = 'Complete todos los campos obligatorios.';
      return;
    }

    this.cargando = true;

    this.usuariosService.crear(this.nuevo).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje || 'Usuario creado correctamente.';
        this.cargando = false;
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al crear usuario.';
        this.cargando = false;
      }
    });
  }

  limpiarFormulario(): void {
    this.nuevo = {
      nombres: '',
      apellidos: '',
      usuario: '',
      password: '',
      rol: 'admin',
      area: ''
    };
  }

  nombreRol(rol: string): string {
    const roles: any = {
      admin: 'Administrador',
      talento_humano: 'Talento Humano',
      ex_funcionario: 'Ex Funcionario',
      area: 'Área',
      recepcion: 'Recepción'
    };

    return roles[rol] || rol;
  }
}