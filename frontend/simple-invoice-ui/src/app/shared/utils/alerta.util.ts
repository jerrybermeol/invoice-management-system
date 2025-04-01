
import Swal from 'sweetalert2';

export class AlertaUtil {
  static exito(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  }

  static error(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  }

  static confirmarEliminar(nombre: string): Promise<any> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar al cliente ${nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }); // <== solo retorna true o false
  }
}
