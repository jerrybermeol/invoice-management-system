using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string UsuarioNombre { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public DateTime FechaAgregado { get; set; } = DateTime.Now;

        public ICollection<Factura>? Facturas { get; set; }
    }
}
