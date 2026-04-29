import { Routes } from '@angular/router';

// AUTH
import { Login } from './auth/login/login';

// ADMIN
import { Dashboard as AdminDashboard } from './admin/dashboard/dashboard';
import { Usuarios } from './admin/usuarios/usuarios';
import { Auditoria } from './admin/auditoria/auditoria';
import { Reportes } from './admin/reportes/reportes';
import { SolicitudesAdmin } from './admin/solicitudes/solicitudes';
import { DetalleSolicitud } from './admin/detalle-solicitud/detalle-solicitud';

// TALENTO HUMANO
import { Dashboard as THDashboard } from './talento-humano/dashboard/dashboard';
import { CrearSolicitud } from './talento-humano/crear-solicitud/crear-solicitud';
import { Historial } from './talento-humano/historial/historial';

// EX FUNCIONARIO
import { Dashboard as ExDashboard } from './ex-funcionario/dashboard/dashboard';
import { DatosPersonales } from './ex-funcionario/datos-personales/datos-personales';
import { Progreso } from './ex-funcionario/progreso/progreso';
import { DocumentoFinal } from './ex-funcionario/documento-final/documento-final';
import { Formulario } from './ex-funcionario/formulario/formulario'; // 🔥 NUEVO

// ÁREAS
import { Dashboard as AreaDashboard } from './areas/dashboard/dashboard';
import { FormularioArea } from './areas/formulario-area/formulario-area';

// RECEPCIÓN
import { Dashboard as RecepcionDashboard } from './recepcion/dashboard/dashboard';
import { RevisionDocumentos } from './recepcion/revision-documentos/revision-documentos';

// GUARDS
import { adminGuard } from './guards/admin-guard';
import { talentoHumanoGuard } from './guards/talento-humano-guard';
import { exFuncionarioGuard } from './guards/ex-funcionario-guard';
import { areaGuard } from './guards/area-guard';
import { recepcionGuard } from './guards/recepcion-guard';

export const routes: Routes = [

  // =========================
  // LOGIN
  // =========================
  { path: '', component: Login },
  { path: 'login', component: Login },

  // =========================
  // ADMIN
  // =========================
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'usuarios', component: Usuarios },
      { path: 'solicitudes', component: SolicitudesAdmin },
      { path: 'solicitudes/:id', component: DetalleSolicitud },
      { path: 'auditoria', component: Auditoria },
      { path: 'reportes', component: Reportes },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // =========================
  // TALENTO HUMANO
  // =========================
  {
    path: 'talento-humano',
    canActivate: [talentoHumanoGuard],
    children: [
      { path: 'dashboard', component: THDashboard },
      { path: 'crear-solicitud', component: CrearSolicitud },
      { path: 'historial', component: Historial },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // =========================
  // EX FUNCIONARIO
  // =========================
  {
    path: 'ex-funcionario',
    canActivate: [exFuncionarioGuard],
    children: [
      { path: 'dashboard', component: ExDashboard },
      { path: 'datos-personales', component: DatosPersonales },

      // 🔥 ESTE ES EL FORMULARIO CLAVE
      { path: 'formulario', component: Formulario },

      { path: 'progreso', component: Progreso },
      { path: 'documento-final', component: DocumentoFinal },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // =========================
  // ÁREAS
  // =========================
  {
    path: 'areas',
    canActivate: [areaGuard],
    children: [
      { path: 'dashboard', component: AreaDashboard },
      { path: 'formulario-area', component: FormularioArea },
      { path: '', redirectTo: 'formulario-area', pathMatch: 'full' }
    ]
  },

  // =========================
  // RECEPCIÓN
  // =========================
  {
    path: 'recepcion',
    canActivate: [recepcionGuard],
    children: [
      { path: 'dashboard', component: RecepcionDashboard },
      { path: 'revision-documentos', component: RevisionDocumentos },
      { path: '', redirectTo: 'revision-documentos', pathMatch: 'full' }
    ]
  },

  // =========================
  // FALLBACK
  // =========================
  { path: '**', redirectTo: '' }
];