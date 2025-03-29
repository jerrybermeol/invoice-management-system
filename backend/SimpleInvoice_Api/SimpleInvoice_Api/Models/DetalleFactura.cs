using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models
{
    public class DetalleFactura
    {
        public int Id { get; set; }

        [Required]
        public int FacturaId { get; set; }

        [Required]
        public int ProductoId { get; set; }

        public int Cantidad { get; set; }

        public decimal PrecioUnitario { get; set; }

        public decimal Subtotal { get; set; }

        // Relaciones
        public Factura? Factura { get; set; }
        public Producto? Producto { get; set; }
    }
}
