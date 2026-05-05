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
  filtrados: Usuario[] = [];

  search = '';
  filtroRol = '';

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
    this.cargando = true;

    this.usuariosService.listar().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data || [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar usuarios.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const texto = this.search.toLowerCase().trim();

    this.filtrados = this.usuarios.filter(u => {
      const coincideTexto =
        !texto ||
        u.nombres?.toLowerCase().includes(texto) ||
        u.apellidos?.toLowerCase().includes(texto) ||
        u.usuario?.toLowerCase().includes(texto) ||
        u.rol?.toLowerCase().includes(texto) ||
        u.area?.toLowerCase().includes(texto) ||
        u.estado?.toLowerCase().includes(texto);

      const coincideRol = !this.filtroRol || u.rol === this.filtroRol;

      return coincideTexto && coincideRol;
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

    if (this.nuevo.rol === 'area' && !this.nuevo.area?.trim()) {
      this.error = 'Debe ingresar el área para usuarios con rol Área.';
      return;
    }

    if (this.nuevo.rol !== 'area') {
      this.nuevo.area = '';
    }

    this.cargando = true;

    this.usuariosService.crear(this.nuevo).subscribe({
      next: (res: any) => {
        this.mensaje = res.mensaje || 'Usuario creado correctamente.';
        this.cargando = false;
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: (err: any) => {
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

  limpiarFiltros(): void {
    this.search = '';
    this.filtroRol = '';
    this.aplicarFiltros();
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

  estadoClase(estado: string): string {
    return estado === 'ACTIVO' ? 'activo' : 'inactivo';
  }
}