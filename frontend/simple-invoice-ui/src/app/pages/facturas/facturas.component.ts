import { Component, OnInit } from '@angular/core';
import { Factura } from '../../shared/models/factura.model';
import { FacturaService } from '../../shared/services/factura.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-facturas',
  standalone: true,
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FacturasComponent implements OnInit {
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  filtro: string = '';

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.facturaService.obtenerFacturas().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = [...this.facturas];
    });
  }

  filtrarFacturas(): void {
    const criterio = this.filtro.toLowerCase();
    this.facturasFiltradas = this.facturas.filter(f =>
      f.cliente.nombre.toLowerCase().includes(criterio) ||
      f.id.toString().includes(criterio)
    );
  }
}
