export interface Factura {
    id: number;
    cliente: {
      nombre: string;
      telefono: string;
      email: string;
    };
    usuario: {
      nombre: string;
    };
    fecha: string;
    total: number;
    estado: 'Pagada' | 'Pendiente';
  }
  