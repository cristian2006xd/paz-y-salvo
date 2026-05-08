import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css'
})
export class Formulario {
  form: any = this.getInitialForm();
  errores: any = {};
  cargando = false;

  usuarioActual: any = { nombres: 'Ex Funcionario' };
  estadoSolicitud = 'PENDIENTE';
  exportando = false;
  archivoSeleccionado: File | null = null;

  estadoAreas: any = {
    tics: 'PENDIENTE',
    financiero: 'PENDIENTE',
    administrativo: 'PENDIENTE',
    seguridad: 'PENDIENTE',
    recursos_humanos: 'PENDIENTE'
  };

  constructor(private router: Router) {}

  get formulario(): any {
    return this.form;
  }

  set formulario(valor: any) {
    this.form = valor;
  }

  irPanelExFuncionario(): void {
    this.router.navigate(['/ex-funcionario/dashboard']);
  }

  getInitialForm(): any {
    return {
      fechaDocumento: '',
      nombres: '',
      cedula: '',
      fechaIngreso: '',
      fechaSalida: '',
      direccion: '',
      celular: '',
      emergencia: '',
      email1: '',
      email2: '',
      provincia: '',
      canton: '',
      unidad: '',
      cargo: '',
      grupoOcupacional: '',
      jefeInmediato: '',

      nombres_completos: '',
      desde: '',
      hasta: '',
      direccion_domicilio: '',
      grupo_ocupacional: '',
      unidad_actual: '',
      correo: '',

      modalidadLaboral: '',
      modPermanente: false,
      modProvisional: false,
      modOcasional: false,
      modTrabajo: false,

      mod_permanente: false,
      mod_provisional: false,
      mod_ocasional: false,
      mod_trabajo: false,

      lugarTrabajo: '',
      lugarPlanta: false,
      lugarDesconcentrados: false,
      lugar_planta: false,
      lugar_desconcentrados: false,

      infoFinOpcion: '',
      infoFinSi: false,
      infoFinNo: false,
      infoFinResp: '',
      info_fin_si: false,
      info_fin_no: false,
      info_fin_resp: '',
      info_fin_firma: '',

      fePresentacionOpcion: '',
      fePresentacionSi: false,
      fePresentacionNo: false,
      fePresentacionResp: '',
      fe_pres_si: false,
      fe_pres_no: false,
      fe_pres_resp: '',
      fe_pres_firma: '',

      archivoOpcion: '',
      archivoSi: false,
      archivoNo: false,
      archivoResp: '',
      doc_fis_dig_si: false,
      doc_fis_dig_no: false,
      doc_fis_dig_resp: '',
      doc_fis_dig_firma: '',

      adminContratoOpcion: '',
      adminContratoSi: false,
      adminContratoNo: false,
      admin_contrato_si: false,
      admin_contrato_no: false,
      descripcionContrato: '',
      desc_contrato: '',
      memoAdministrador: '',
      num_memo_admin: '',
      jefe_inmediato: '',

      seg_digitales_si: false,
      seg_digitales_no: false,
      seg_informe_si: false,
      seg_informe_no: false,
      seg_fisicos_si: false,
      seg_fisicos_no: false,
      seg_verificacion_si: false,
      seg_verificacion_no: false,
      seg_oficial_nombre: '',
      seg_resp: '',
      seg_firma: '',

      rh_cursos_si: false,
      rh_cursos_no: false,
      rh_cursos_resp: '',
      rh_cursos_firma: '',
      rh_eval_si: false,
      rh_eval_no: false,
      rh_eval_resp: '',
      rh_eval_firma: '',
      rh_viajes_si: false,
      rh_viajes_no: false,
      rh_viajes_resp: '',
      rh_viajes_firma: '',
      rh_siith_si: false,
      rh_siith_no: false,
      rh_siith_resp: '',
      rh_siith_firma: '',
      rh_dias_vacaciones: '',
      rh_num_cert_vac: '',
      rh_vac_firma: '',
      rh_dec_jur_si: false,
      rh_dec_jur_no: false,
      rh_num_dec_jur: '',
      rh_dec_jur_firma: '',
      rh_credencial_si: false,
      rh_credencial_no: false,
      rh_acta_bienes_obs: '',
      rh_acta_bienes_firma: '',
      rh_cd_si: false,
      rh_cd_no: false,
      rh_ropa_si: false,
      rh_ropa_no: false,
      rh_dir_nombre: '',

      recep_fecha: '',
      recep_hojas: '',
      recep_nombre: '',
      recep_firma: '',
      recep_cargo: ''
    };
  }

  sincronizarCampos(): void {
    this.form.nombres_completos = this.form.nombres;
    this.form.desde = this.form.fechaIngreso;
    this.form.hasta = this.form.fechaSalida;
    this.form.direccion_domicilio = this.form.direccion;
    this.form.grupo_ocupacional = this.form.grupoOcupacional;
    this.form.unidad_actual = this.form.unidad;

    this.form.mod_permanente = this.form.modPermanente;
    this.form.mod_provisional = this.form.modProvisional;
    this.form.mod_ocasional = this.form.modOcasional;
    this.form.mod_trabajo = this.form.modTrabajo;

    this.form.lugar_planta = this.form.lugarPlanta;
    this.form.lugar_desconcentrados = this.form.lugarDesconcentrados;

    this.form.info_fin_si = this.form.infoFinSi;
    this.form.info_fin_no = this.form.infoFinNo;
    this.form.info_fin_resp = this.form.infoFinResp;

    this.form.fe_pres_si = this.form.fePresentacionSi;
    this.form.fe_pres_no = this.form.fePresentacionNo;
    this.form.fe_pres_resp = this.form.fePresentacionResp;

    this.form.doc_fis_dig_si = this.form.archivoSi;
    this.form.doc_fis_dig_no = this.form.archivoNo;
    this.form.doc_fis_dig_resp = this.form.archivoResp;

    this.form.admin_contrato_si = this.form.adminContratoSi;
    this.form.admin_contrato_no = this.form.adminContratoNo;
    this.form.desc_contrato = this.form.descripcionContrato;
    this.form.num_memo_admin = this.form.memoAdministrador;
    this.form.jefe_inmediato = this.form.jefeInmediato;
  }

  seleccionarModalidadSelect(): void {
    this.form.modPermanente = false;
    this.form.modProvisional = false;
    this.form.modOcasional = false;
    this.form.modTrabajo = false;

    if (this.form.modalidadLaboral) {
      this.form[this.form.modalidadLaboral] = true;
    }

    this.sincronizarCampos();
    this.validarFormulario();
  }

  seleccionarLugarTrabajo(): void {
    this.form.lugarPlanta = false;
    this.form.lugarDesconcentrados = false;

    if (this.form.lugarTrabajo) {
      this.form[this.form.lugarTrabajo] = true;
    }

    this.sincronizarCampos();
    this.validarFormulario();
  }

  seleccionarSiNo(campo: string): void {
    this.form[`${campo}Si`] = this.form[`${campo}Opcion`] === 'si';
    this.form[`${campo}No`] = this.form[`${campo}Opcion`] === 'no';
    this.sincronizarCampos();
    this.validarFormulario();
  }

  soloLetrasInput(campo: string): void {
    this.form[campo] = String(this.form[campo] || '').replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    this.sincronizarCampos();
    this.validarFormulario();
  }

  soloNumerosInput(campo: string, max: number): void {
    this.form[campo] = String(this.form[campo] || '').replace(/[^0-9]/g, '').slice(0, max);
    this.sincronizarCampos();
    this.validarFormulario();
  }

  validarFormulario(): boolean {
    this.sincronizarCampos();
    this.errores = {};

    const requerido = (campo: string): void => {
      if (!this.form[campo] || String(this.form[campo]).trim() === '') {
        this.errores[campo] = 'Campo obligatorio.';
      }
    };

    const soloNumeros = (campo: string, min: number, max: number, msg: string): void => {
      const valor = String(this.form[campo] || '').trim();
      if (!/^[0-9]+$/.test(valor) || valor.length < min || valor.length > max) {
        this.errores[campo] = msg;
      }
    };

    [
      'nombres', 'cedula', 'fechaIngreso', 'fechaSalida', 'direccion',
      'celular', 'emergencia', 'email1', 'email2', 'provincia', 'canton',
      'unidad', 'cargo', 'grupoOcupacional', 'jefeInmediato',
      'lugarTrabajo', 'infoFinOpcion', 'infoFinResp',
      'fePresentacionOpcion', 'fePresentacionResp',
      'archivoOpcion', 'archivoResp', 'adminContratoOpcion'
    ].forEach(campo => requerido(campo));

    soloNumeros('cedula', 10, 10, 'La cédula debe tener 10 números.');
    soloNumeros('celular', 10, 10, 'El celular debe tener 10 números.');
    soloNumeros('emergencia', 7, 10, 'El contacto debe tener entre 7 y 10 números.');

    if (!this.form.modalidadLaboral) this.errores.modalidad = 'Seleccione una modalidad laboral.';
    if (!this.form.lugarTrabajo) this.errores.lugarTrabajo = 'Seleccione el lugar de trabajo.';

    if (this.form.fechaIngreso && this.form.fechaSalida) {
      if (new Date(this.form.fechaSalida) < new Date(this.form.fechaIngreso)) {
        this.errores.fechaSalida = 'La fecha de salida no puede ser anterior a la fecha de ingreso.';
      }
    }

    return Object.keys(this.errores).length === 0;
  }

  formularioCompleto(): boolean {
    const copiaErrores = { ...this.errores };
    const valido = this.validarFormulario();
    this.errores = copiaErrores;
    return valido;
  }

  guardar(): void {
    if (!this.validarFormulario()) {
      alert('Complete correctamente todo el formulario antes de guardar.');
      return;
    }

    localStorage.setItem('formulario_paz_salvo', JSON.stringify(this.form));
    alert('Formulario guardado correctamente.');
  }

  guardarDatos(): void {
    this.guardar();
  }

  limpiar(): void {
    if (!confirm('¿Seguro que deseas limpiar el formulario?')) return;
    this.form = this.getInitialForm();
    this.errores = {};
    localStorage.removeItem('formulario_paz_salvo');
  }

  limpiarFormulario(): void {
    this.limpiar();
  }

  imprimir(): void {
    if (!this.validarFormulario()) {
      alert('Complete correctamente todo el formulario antes de imprimir.');
      return;
    }

    window.print();
  }

  exportarPDF(): void {
    this.imprimir();
  }

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files?.[0] || null;
  }

  subirDocumento(): void {
    alert('Documento seleccionado correctamente.');
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}