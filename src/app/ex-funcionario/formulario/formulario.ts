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
      obsCuentas: '',

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

  guardar(): void {
    localStorage.setItem('formulario_paz_salvo', JSON.stringify(this.form));
    alert('Formulario guardado correctamente.');
  }

  cargar(): void {
    const data = localStorage.getItem('formulario_paz_salvo');

    if (!data) {
      alert('No hay datos guardados.');
      return;
    }

    this.form = JSON.parse(data);
    alert('Datos cargados correctamente.');
  }

  limpiar(): void {
    if (!confirm('¿Seguro que deseas limpiar el formulario?')) return;

    this.form = this.getInitialForm();
    localStorage.removeItem('formulario_paz_salvo');
  }

  imprimir(): void {
    window.print();
  }
}