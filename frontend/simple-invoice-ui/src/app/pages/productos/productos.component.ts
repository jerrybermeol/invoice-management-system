import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../shared/services/producto.service';
import { Producto } from '../../shared/models/producto.model';
import { AlertaUtil } from '../../shared/utils/alerta.util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosPaginados: Producto[] = [];

  filtro: string = '';
  paginaActual = 1;
  productosPorPagina = 8;

  mostrarFormularioCrear = false;
  mostrarFormularioEditar = false;

  formCrearProducto!: FormGroup;
  formEditarProducto!: FormGroup;
  productoEditando: Producto | null = null;

  constructor(private productoService: ProductoService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.formCrearProducto = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      //precio: ['', [Validators.required, Validators.min(0.01)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
    });

    this.formEditarProducto = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
    });

  }  

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe((productos) => {
      this.productos = productos;
      this.filtrarProductos();
    });
  }
  filtrarProductos(): void {
    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      p.codigo.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.actualizarPaginado();
  }
  actualizarPaginado(): void {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    this.productosPaginados = this.productosFiltrados.slice(inicio, fin);
  }
  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
      this.actualizarPaginado();
    }
  }
  anteriorPagina(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginado();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
  }
  crearProducto(): void {
    if (this.formCrearProducto.invalid) {
      this.formCrearProducto.markAllAsTouched();
      return;
    }
  
    const producto = this.formCrearProducto.value;
    this.productoService.crearProducto(producto).subscribe({
      next: () => {
        AlertaUtil.exito('Producto creado correctamente');
        this.mostrarFormularioCrear = false;
        this.formCrearProducto.reset();
        this.cargarProductos(); // Refresca la lista
      },
      error: () => {
        AlertaUtil.error('No se pudo crear el producto');
      }
    });
  }

  mostrarFormularioEditarProducto(producto: Producto): void {
    this.productoEditando = producto;
    this.formEditarProducto.patchValue(producto);
    this.mostrarFormularioEditar = true;
  }
  editarProducto(): void {
    if (this.formEditarProducto.invalid) {
      this.formEditarProducto.markAllAsTouched(); // 🔥 Esto muestra errores si ya hay campos vacíos
      return;
    }
  
    const productoActualizado = this.formEditarProducto.value;
    this.productoService.actualizarProducto(productoActualizado.id, productoActualizado).subscribe({
      next: () => {
        AlertaUtil.exito('Producto actualizado correctamente');
        this.mostrarFormularioEditar = false;
        this.cargarProductos(); // Actualiza la lista
      },
      error: () => {
        AlertaUtil.error('No se pudo actualizar el producto');
      }
    });
  }
  eliminarProducto(id: number, nombre: string): void {
    AlertaUtil.confirmarEliminar(nombre, 'producto').then((res) => {
      if (res.isConfirmed) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            AlertaUtil.exito('Producto eliminado correctamente');
            this.cargarProductos(); // Refresca la tabla
          },
          error: () => {
            AlertaUtil.error('Error al eliminar el producto');
          }
        });
      }
    });
  }
  
}
