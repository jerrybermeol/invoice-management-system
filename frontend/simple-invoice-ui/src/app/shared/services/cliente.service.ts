import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'https://localhost:7230/api/Clientes';

  constructor(private http: HttpClient) {}

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, cliente);
  }

  actualizarCliente(id: number, cliente: Cliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente);
  }
}
