import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // 👈 Importa esto
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertaUtil } from '../../shared/utils/alerta.util';



@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // 👈 Agrega FormsModule aquí
  templateUrl: './usuarios.component.html'
})

export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtro: string = '';
  mostrarFormulario = false;
  editando: boolean = false;
  formCrearUsuario: FormGroup;
  formEditarUsuario: FormGroup;

  mostrarFormularioCrear = false;
  mostrarFormularioEditar = false;
  //constructor(private http: HttpClient) {}
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formCrearUsuario = this.fb.group({
      nombre: ['', Validators.required],
      usuarioNombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repetirPassword: ['', Validators.required],
      rol: ['user']
    });

    this.formEditarUsuario = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      usuarioNombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['user', Validators.required]
    });
  }

  ngOnInit() {
    this.http.get<any[]>('https://localhost:7230/api/Usuarios')
      .subscribe(data => {
        this.usuarios = data;
        this.usuariosFiltrados = data; // Inicialmente mostramos todos
      });
  }

  buscarUsuarios() {
    const termino = this.filtro.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino)
    );
  }

  nuevoUsuario() {
    this.mostrarFormularioCrear = true;
    this.formCrearUsuario.reset(); // limpia el formulario
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://localhost:7230/api/Usuarios')
      .subscribe(data => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      });
  }

  eliminarUsuario(id: number, nombre: string): void {
    AlertaUtil.confirmarEliminar(nombre, 'usuario').then((resultado) => {
      if (!resultado.isConfirmed) return;
  
      this.http.delete(`https://localhost:7230/api/Usuarios/${id}`).subscribe({
        next: () => {
          AlertaUtil.exito('Usuario eliminado correctamente');
          this.obtenerUsuarios(); // Recarga la lista
        },
        error: (err) => {
          console.error(err);
          AlertaUtil.error('Error al eliminar el usuario');
        }
      });
    });
  }
  

  actualizarUsuario() {
    console.log('Actualizando usuario...');
    if (this.formEditarUsuario.invalid) {
      console.log('Formulario inválido', this.formEditarUsuario.value);
      return;
    }

    const usuarioActualizado = this.formEditarUsuario.value;
    const id = usuarioActualizado.id;
    console.log('Actualizando id...', id);

    this.http.put(`https://localhost:7230/api/Usuarios/${id}`, usuarioActualizado).subscribe({
      next: () => {
        //alert('Usuario actualizado exitosamente');
        AlertaUtil.exito('Usuario actualizado exitosamente');
        this.obtenerUsuarios();
        this.cerrarFormulario();
      },
      error: err => {
        console.error(err);
        //alert('Error al actualizar el usuario');
        AlertaUtil.error('Error al actualizar el usuario');
      }
    });
  }
  

  editarUsuario(usuario: any) {
    //console.log('Entrando a editarUsuario', usuario);
    this.mostrarFormularioEditar = true;
    this.formEditarUsuario.patchValue({
      id: usuario.id,
      nombre: usuario.nombre,
      usuarioNombre: usuario.usuarioNombre,
      email: usuario.email,
      rol: usuario.rol
    });
  }
  

  guardarUsuario() {
    console.log('guardarUsuario usuario...');
    if (this.formCrearUsuario.invalid) {
      console.log('Formulario inválido', this.formCrearUsuario.value);
      this.formCrearUsuario.markAllAsTouched(); // Muy importante
      return;
    }    

    const usuario = this.formCrearUsuario.value;
    if (usuario.password !== usuario.repetirPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.http.post('https://localhost:7230/api/Usuarios', usuario).subscribe({
      next: () => {
        //alert('Usuario creado exitosamente');
        AlertaUtil.exito('Usuario creado exitosamente');
        this.mostrarFormularioCrear = false;
        this.formCrearUsuario.reset();
        this.obtenerUsuarios();
      },
      error: (err) => {
        console.error(err);
        //alert('Error al crear usuario');
        AlertaUtil.error('Error al crear el usuario');
      }
    });
  }

  cerrarFormulario() {
    this.mostrarFormularioCrear = false;
    this.mostrarFormularioEditar = false;
  }
  abrirModalCrear() {
    this.formCrearUsuario.reset();
    this.formCrearUsuario.get('rol')?.setValue('user');
    this.mostrarFormularioCrear = true;
  }
  
}
