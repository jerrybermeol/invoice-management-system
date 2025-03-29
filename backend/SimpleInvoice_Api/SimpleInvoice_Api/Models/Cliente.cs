using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required]
        public string Identificacion { get; set; } = string.Empty;

        [Required]
        public string Nombre { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Direccion { get; set; } = string.Empty;

        public string Estado { get; set; } = "Activo";

        public DateTime FechaAgregado { get; set; } = DateTime.Now;

        // Relación con Facturas
        public ICollection<Factura>? Facturas { get; set; }
    }

}
