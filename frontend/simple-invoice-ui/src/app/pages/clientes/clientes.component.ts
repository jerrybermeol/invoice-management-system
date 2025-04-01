import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../shared/services/cliente.service';
import { Cliente } from '../../shared/models/cliente.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertaUtil } from '../../shared/utils/alerta.util';




@Component({
  selector: 'app-clientes',
  standalone: true,
  // imports: [HttpClientModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  imports: [CommonModule, FormsModule,ReactiveFormsModule]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  filtro: string = '';

  mostrarFormularioCrear = false;
  mostrarFormularioEditar = false;
  // Paginación básica
  paginaActual: number = 1;
  clientesPorPagina: number = 5;

  formCrearCliente!: FormGroup;
  formEditarCliente!: FormGroup;

  clienteEditando: Cliente | null = null;

  constructor(private clienteService: ClienteService, private fb: FormBuilder ) {}

  ngOnInit(): void {
    this.formCrearCliente = this.fb.group({
      identificacion: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required]
    });

    this.formEditarCliente = this.fb.group({
      id: [''],
      identificacion: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required]
    });

    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
        this.clientesFiltrados = [...this.clientes];
      },
      error: (err: any) => console.error('Error cargando clientes:', err)
    });
  }

  actualizarFiltrados(): void {
    this.clientesFiltrados = this.clientes
      .filter((c) =>
        c.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      )
      .slice(
        (this.paginaActual - 1) * this.clientesPorPagina,
        this.paginaActual * this.clientesPorPagina
      );
  }

  buscarClientes(): void {
    const termino = this.filtro.trim().toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(termino)
    );
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarFiltrados();
    }
  }
  paginaSiguiente(): void {
    const totalPaginas = Math.ceil(
      this.clientes.filter((c) =>
        c.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      ).length / this.clientesPorPagina
    );
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
      this.actualizarFiltrados();
    }
  }

  // Calcula el índice para paginar
  get clientesPaginados(): Cliente[] {
    const inicio = (this.paginaActual - 1) * this.clientesPorPagina;
    return this.clientesFiltrados.slice(inicio, inicio + this.clientesPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.clientesPorPagina);
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
    }
  }

  anteriorPagina(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  nuevoCliente(): void {
    // Aquí podrías mostrar el modal para crear cliente
    console.log('Abrir modal para nuevo cliente');
  }

  crearCliente() {
    if (this.formCrearCliente.invalid) {
      this.formCrearCliente.markAllAsTouched();  //Marca campos como tocados para mostrar errores
      return;
    }
  
    const cliente = this.formCrearCliente.value;
  
    this.clienteService.crearCliente(cliente).subscribe({
      next: () => {
        //alert(' Cliente creado correctamente');
        // Al crear cliente exitosamente
        AlertaUtil.exito('Cliente creado correctamente');
        this.formCrearCliente.reset();           // Limpia el formulario
        this.mostrarFormularioCrear = false;     // Cierra el modal
        this.cargarClientes();                   // Recarga la tabla
      },
      error: (err) => {
        console.error('Error al crear cliente', err);
        //alert(' Error al crear cliente');
        AlertaUtil.error('Ocurrió un error al crear el cliente');
      }
    });
  }

  editarCliente(): void {
    if (this.formEditarCliente.invalid) {
      AlertaUtil.error('Completa todos los campos correctamente.');
      return;
    }
  
    const clienteActualizado = this.formEditarCliente.value;
    this.clienteService.actualizarCliente(clienteActualizado.id, clienteActualizado).subscribe({
      next: () => {
        AlertaUtil.exito('Cliente actualizado correctamente.');
        this.cargarClientes(); // actualiza la lista
        this.mostrarFormularioEditar = false;
      },
      error: () => {
        AlertaUtil.error('No se pudo actualizar el cliente.');
      }
    });
  }  

  eliminarCliente(id: number, nombre: string) {
  AlertaUtil.confirmarEliminar(nombre, 'cliente').then(result => {    
    if (result.isConfirmed) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          AlertaUtil.exito('Cliente eliminado correctamente');
          this.cargarClientes(); // recarga la lista
        },
        error: () => AlertaUtil.error('Error al eliminar el cliente')
      });
    }
  });
}

abrirEditarCliente(cliente: Cliente): void {
  this.formEditarCliente.patchValue(cliente);
  this.mostrarFormularioEditar = true;
}

mostrarFormularioEditarCliente(cliente: Cliente): void {
  this.formEditarCliente.patchValue(cliente);
  this.clienteEditando = cliente;
  this.mostrarFormularioEditar = true;
}
}
