import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  nuevo: Usuario = this.getNuevoUsuario();

  errores: any = {};
  cargando = false;
  mensaje = '';
  error = '';

  editando = false;
  usuarioEditandoId: number | null = null;

  rolesValidos = [
    'admin',
    'talento_humano',
    'ex_funcionario',
    'administrativa',
    'financiera',
    'tics',
    'seguridad'
  ];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  irDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  getNuevoUsuario(): Usuario {
    return {
      nombres: '',
      apellidos: '',
      usuario: '',
      password: '',
      rol: ''
    };
  }

  tieneErrores(): boolean {
    return Object.keys(this.errores).length > 0;
  }

  limpiarTexto(valor: string): string {
    return String(valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/\s+/g, '')
      .replace(/[^a-z]/g, '');
  }

  generarUsuarioAutomatico(): void {
    const nombres = String(this.nuevo.nombres || '').trim();
    const apellidos = String(this.nuevo.apellidos || '').trim();

    if (!nombres || !apellidos) {
      this.nuevo.usuario = '';
      this.validarFormulario();
      return;
    }

    const primeraLetra = this.limpiarTexto(nombres).charAt(0);
    const apellidoCompleto = this.limpiarTexto(apellidos);

    this.nuevo.usuario = `${primeraLetra}${apellidoCompleto}`.slice(0, 30);
    this.validarFormulario();
  }

  soloLetrasInput(campo: 'nombres' | 'apellidos'): void {
    this.nuevo[campo] = String(this.nuevo[campo] || '')
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
      .slice(0, 45);

    this.generarUsuarioAutomatico();
  }

  cambiarRol(): void {
    this.validarFormulario();
  }

  validarFormulario(): boolean {
    this.errores = {};

    const validarLetras = (campo: 'nombres' | 'apellidos'): void => {
      const valor = String(this.nuevo[campo] || '').trim();

      if (!valor) {
        this.errores[campo] = 'Campo obligatorio.';
        return;
      }

      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
        this.errores[campo] = 'Solo letras.';
      }
    };

    validarLetras('nombres');
    validarLetras('apellidos');

    const usuario = String(this.nuevo.usuario || '').trim();

    if (!usuario) {
      this.errores.usuario = 'Campo obligatorio.';
    } else if (usuario.length < 4) {
      this.errores.usuario = 'Mínimo 4 caracteres.';
    } else if (!/^[A-Za-z0-9._-]+$/.test(usuario)) {
      this.errores.usuario = 'Usuario inválido.';
    }

    const password = String(this.nuevo.password || '').trim();

    if (!this.editando) {
      if (!password) {
        this.errores.password = 'Campo obligatorio.';
      } else if (password.length < 6) {
        this.errores.password = 'Mínimo 6 caracteres.';
      }
    }

    if (!this.nuevo.rol) {
      this.errores.rol = 'Seleccione un rol.';
    } else if (!this.rolesValidos.includes(this.nuevo.rol)) {
      this.errores.rol = 'Rol inválido.';
    }

    return Object.keys(this.errores).length === 0;
  }

  formularioValido(): boolean {
    const copia = { ...this.errores };
    const valido = this.validarFormulario();
    this.errores = copia;
    return valido;
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.usuariosService.listar().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data || [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar usuarios.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const texto = this.search.toLowerCase().trim();

    this.filtrados = this.usuarios.filter(u =>
      !texto ||
      u.nombres?.toLowerCase().includes(texto) ||
      u.apellidos?.toLowerCase().includes(texto) ||
      u.usuario?.toLowerCase().includes(texto) ||
      u.rol?.toLowerCase().includes(texto) ||
      u.estado?.toLowerCase().includes(texto)
    );
  }

  crearUsuario(): void {
    this.mensaje = '';
    this.error = '';

    this.generarUsuarioAutomatico();

    if (!this.validarFormulario()) {
      this.error = 'Formulario inválido.';
      return;
    }

    this.cargando = true;

    this.usuariosService.crear(this.nuevo).subscribe({
      next: () => {
        this.mensaje = 'Usuario creado correctamente.';
        this.cargando = false;
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: () => {
        this.error = 'Error al crear usuario.';
        this.cargando = false;
      }
    });
  }

  editarUsuario(u: Usuario): void {
    this.editando = true;
    this.usuarioEditandoId = u.id || null;
    this.nuevo = { ...u, password: '' };
    this.generarUsuarioAutomatico();
    this.errores = {};
  }

  actualizarUsuario(): void {
    if (!this.usuarioEditandoId) return;

    this.mensaje = '';
    this.error = '';
    this.generarUsuarioAutomatico();

    if (!this.validarFormulario()) {
      this.error = 'Formulario inválido.';
      return;
    }

    this.usuariosService.actualizar(this.usuarioEditandoId, this.nuevo).subscribe({
      next: () => {
        this.mensaje = 'Usuario actualizado correctamente.';
        this.cancelarEdicion();
        this.cargarUsuarios();
      },
      error: () => {
        this.error = 'Error al actualizar usuario.';
      }
    });
  }

  desactivarUsuario(id: number): void {
    if (!confirm('¿Seguro que deseas desactivar este usuario?')) return;

    this.usuariosService.desactivar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.error = 'Error al desactivar usuario.'
    });
  }

  activarUsuario(id: number): void {
    if (!confirm('¿Seguro que deseas activar este usuario?')) return;

    this.usuariosService.activar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.error = 'Error al activar usuario.'
    });
  }

  eliminarUsuario(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.usuariosService.eliminar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.error = 'Error al eliminar usuario.'
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.usuarioEditandoId = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevo = this.getNuevoUsuario();
    this.errores = {};
  }

  nombreRol(rol: string): string {
    const roles: any = {
      admin: 'Administrador',
      talento_humano: 'Talento Humano',
      ex_funcionario: 'Ex Funcionario',
      administrativa: 'Administrativa',
      financiera: 'Financiera',
      tics: 'TICs',
      seguridad: 'Seguridad'
    };

    return roles[rol] || rol;
  }
}