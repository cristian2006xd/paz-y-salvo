import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasService } from '../../services/areas';

@Component({
  selector: 'app-area-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  areas: any[] = [];
  solicitudId = 1; // temporal

  constructor(private areasService: AreasService) {}

  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas() {
    this.areasService.obtenerPorSolicitud(this.solicitudId).subscribe({
      next: (data) => {
        this.areas = data;
      }
    });
  }

  completar(area: any) {
    this.areasService.actualizarArea(area.id, {
      estado: 'COMPLETADO',
      comentario: 'Validado correctamente'
    }).subscribe(() => {
      this.cargarAreas();
    });
  }
}