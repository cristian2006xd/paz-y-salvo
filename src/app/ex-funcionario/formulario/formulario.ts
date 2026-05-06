import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

      modalidadLaboral: '',

      modPermanente: false,
      modProvisional: false,
      modOcasional: false,
      modTrabajo: false,

      lugarPlanta: false,
      lugarDesconcentrados: false,

      responsableAdministrativa: '',
      responsableTics: '',
      responsableFinanciera: '',
      responsableTalentoHumano: '',
      responsableSeguridad: '',
      responsableRecepcion: '',

      obsAdministrativa: '',
      obsTics: '',
      obsFinanciera: '',
      obsCuentas: '',

      infoFinSi: false,
      infoFinNo: false,
      infoFinResp: '',

      fePresentacionSi: false,
      fePresentacionNo: false,
      fePresentacionResp: '',

      archivoSi: false,
      archivoNo: false,
      archivoResp: '',

      adminContratoSi: false,
      adminContratoNo: false,
      descripcionContrato: '',
      memoAdministrador: '',

      bienesSi: false,
      bienesNo: false,
      numeroActaBienes: '',

      deduciblesSi: false,
      deduciblesNo: false,
      valorDeducibles: '',

      pasajesSi: false,
      pasajesNo: false,
      valorPasajes: '',

      quipuxSi: false,
      quipuxNo: false,
      quipuxRecibe: '',

      clavesSi: false,
      clavesNo: false,
      actaClavesSi: false,
      actaClavesNo: false,
      obsClaves: '',

      ticEquipoSi: false,
      ticEquipoNo: false,
      ticIpSi: false,
      ticIpNo: false,
      ticRetiroSi: false,
      ticRetiroNo: false,
      ticBackupSi: false,
      ticBackupNo: false,
      rutaBackup: '',

      ticCorreoSi: false,
      ticCorreoNo: false,
      ticEsigefSi: false,
      ticEsigefNo: false,
      ticSprynSi: false,
      ticSprynNo: false,
      ticQuipuxSi: false,
      ticQuipuxNo: false,
      ticEsbyeSi: false,
      ticEsbyeNo: false,
      ticTarjetaSi: false,
      ticTarjetaNo: false,

      finSaldosSi: false,
      finSaldosNo: false,
      finSaldosValor: '',
      finSaldosObs: '',

      finAnticipoSi: false,
      finAnticipoNo: false,
      finAnticipoValor: '',
      finAnticipoObs: '',

      finRecuperacionSi: false,
      finRecuperacionNo: false,
      finRecuperacionValor: '',
      finRecuperacionObs: '',

      finMueblesSi: false,
      finMueblesNo: false,
      finMueblesValor: '',
      finMueblesObs: '',

      directorFinanciero: '',

      segDigitalesSi: false,
      segDigitalesNo: false,
      segInformeSi: false,
      segInformeNo: false,
      segFisicosSi: false,
      segFisicosNo: false,
      segVerificacionSi: false,
      segVerificacionNo: false,
      oficialSeguridad: '',

      rhCursosSi: false,
      rhCursosNo: false,
      rhEvalSi: false,
      rhEvalNo: false,
      rhViajesSi: false,
      rhViajesNo: false,
      rhSiithSi: false,
      rhSiithNo: false,

      diasVacaciones: '',
      certificadoVacaciones: '',

      rhDeclaracionSi: false,
      rhDeclaracionNo: false,
      numeroDeclaracion: '',

      rhCredencialSi: false,
      rhCredencialNo: false,
      rhCdSi: false,
      rhCdNo: false,
      rhRopaSi: false,
      rhRopaNo: false,

      actaBienesCustodio: '',
      directorTalentoHumano: '',

      fechaRecepcion: '',
      hojasRecibidas: '',
      cargoRecepcion: ''
    };
  }

  seleccionarModalidadSelect(): void {
    this.form.modPermanente = false;
    this.form.modProvisional = false;
    this.form.modOcasional = false;
    this.form.modTrabajo = false;

    if (this.form.modalidadLaboral) {
      this.form[this.form.modalidadLaboral] = true;
    }

    this.validarFormulario();
  }

  soloLetrasInput(campo: string): void {
    this.form[campo] = String(this.form[campo] || '')
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');

    const palabras = this.form[campo].trim().split(/\s+/).filter((p: string) => p);

    if (palabras.length > 35) {
      this.form[campo] = palabras.slice(0, 35).join(' ');
    }

    this.validarFormulario();
  }

  soloNumerosInput(campo: string, max: number): void {
    this.form[campo] = String(this.form[campo] || '')
      .replace(/[^0-9]/g, '')
      .slice(0, max);

    this.validarFormulario();
  }

  validarFormulario(): boolean {
    this.errores = {};

    const requerido = (campo: string): void => {
      if (!this.form[campo] || String(this.form[campo]).trim() === '') {
        this.errores[campo] = 'Campo obligatorio.';
      }
    };

    const soloLetras = (campo: string): void => {
      const valor = String(this.form[campo] || '').trim();

      if (!valor) {
        this.errores[campo] = 'Campo obligatorio.';
        return;
      }

      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
        this.errores[campo] = 'Solo se permiten letras.';
        return;
      }

      const palabras = valor.split(/\s+/).filter(p => p.length > 0);

      if (palabras.length > 35) {
        this.errores[campo] = 'Máximo 35 palabras permitidas.';
      }
    };

    const soloNumeros = (campo: string, min: number, max: number, msg: string): void => {
      const valor = String(this.form[campo] || '').trim();

      if (!valor) {
        this.errores[campo] = 'Campo obligatorio.';
        return;
      }

      if (!/^[0-9]+$/.test(valor)) {
        this.errores[campo] = 'Solo se permiten números.';
        return;
      }

      if (valor.length < min || valor.length > max) {
        this.errores[campo] = msg;
      }
    };

    const validarEmail = (campo: string): void => {
      const valor = String(this.form[campo] || '').trim();

      if (!valor) {
        this.errores[campo] = 'Campo obligatorio.';
        return;
      }

      if (valor.length > 30) {
        this.errores[campo] = 'Máximo 30 caracteres.';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        this.errores[campo] = 'Correo inválido. Debe contener @.';
      }
    };

    [
      'nombres',
      'cedula',
      'fechaIngreso',
      'fechaSalida',
      'direccion',
      'celular',
      'emergencia',
      'email1',
      'email2',
      'provincia',
      'canton',
      'unidad',
      'cargo',
      'grupoOcupacional',
      'jefeInmediato'
    ].forEach(campo => requerido(campo));

    soloLetras('nombres');
    soloLetras('provincia');
    soloLetras('canton');

    soloNumeros('cedula', 10, 10, 'La cédula debe tener 10 números.');
    soloNumeros('celular', 10, 10, 'El celular debe tener 10 números.');
    soloNumeros('emergencia', 7, 10, 'El contacto debe tener entre 7 y 10 números.');

    validarEmail('email1');
    validarEmail('email2');

    if (!this.form.modalidadLaboral) {
      this.errores.modalidad = 'Seleccione una modalidad laboral.';
    }

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

  cargar(): void {
    const data = localStorage.getItem('formulario_paz_salvo');

    if (!data) {
      alert('No hay datos guardados.');
      return;
    }

    this.form = {
      ...this.getInitialForm(),
      ...JSON.parse(data)
    };

    this.validarFormulario();
    alert('Datos cargados correctamente.');
  }

  limpiar(): void {
    if (!confirm('¿Seguro que deseas limpiar el formulario?')) return;

    this.form = this.getInitialForm();
    this.errores = {};
    localStorage.removeItem('formulario_paz_salvo');
  }

  imprimir(): void {
    if (!this.validarFormulario()) {
      alert('Complete correctamente todo el formulario antes de imprimir.');
      return;
    }

    window.print();
  }
}