using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models
{
    public class FormaPago
    {
        public int Id { get; set; }

        [Required]
        public int FacturaId { get; set; }

        [Required]
        public string Metodo { get; set; } = string.Empty;

        public decimal Monto { get; set; }

        // Relación
        public Factura? Factura { get; set; }
    }
}
