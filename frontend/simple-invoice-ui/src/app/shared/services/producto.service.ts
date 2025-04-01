import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'https://localhost:7230/api/Productos';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }
}
