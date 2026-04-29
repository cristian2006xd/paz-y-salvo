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

  datos = {
    nombre: '',
    cedula: '',
    cargo: '',
    unidad: '',
    fechaIngreso: '',
    fechaSalida: '',
    motivoSalida: '',
    correo: '',
    telefono: '',

    direccionAdministrativa: '',
    bienes: '',
    observacionBienes: '',

    tecnologias: '',
    usuarioCorreo: '',
    equiposTecnologicos: '',
    observacionTics: '',

    financiera: '',
    valoresPendientes: '',
    observacionFinanciera: '',

    talentoHumano: '',
    documentosEntregados: '',
    observacionTH: '',

    recepcion: '',
    observacionRecepcion: '',

    autorizacion: '',
    fechaFormulario: ''
  };

  mensaje = '';

  guardar(): void {
    localStorage.setItem('formulario_paz_salvo', JSON.stringify(this.datos));
    this.mensaje = 'Formulario guardado correctamente.';
  }

  cargar(): void {
    const data = localStorage.getItem('formulario_paz_salvo');
    if (data) {
      this.datos = JSON.parse(data);
      this.mensaje = 'Datos cargados correctamente.';
    }
  }

  limpiar(): void {
    if (confirm('¿Seguro que desea limpiar el formulario?')) {
      Object.keys(this.datos).forEach(key => {
        (this.datos as any)[key] = '';
      });
      this.mensaje = 'Formulario limpiado.';
    }
  }

  imprimir(): void {
    window.print();
  }
}