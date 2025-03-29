using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models
{
    public class Factura
    {
        public int Id { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        public decimal Total { get; set; }

        public DateTime FechaAgregado { get; set; } = DateTime.Now;

        // Relaciones
        public Cliente? Cliente { get; set; }
        public Usuario? Usuario { get; set; }
        public ICollection<DetalleFactura>? Detalles { get; set; }
        public ICollection<FormaPago>? FormasPago { get; set; }
    }
}
