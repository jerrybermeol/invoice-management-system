using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models
{
    public class Producto
    {
        public int Id { get; set; }

        [Required]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        public string Nombre { get; set; } = string.Empty;

        public decimal Precio { get; set; }

        public string Estado { get; set; } = "Activo";

        public DateTime FechaAgregado { get; set; } = DateTime.Now;
    }
}
