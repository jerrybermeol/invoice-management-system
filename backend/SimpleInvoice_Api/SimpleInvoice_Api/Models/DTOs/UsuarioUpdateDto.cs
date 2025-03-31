using System.ComponentModel.DataAnnotations;

namespace SimpleInvoice_Api.Models.DTOs
{
    public class UsuarioUpdateDto
    {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }

        [Required]
        public string UsuarioNombre { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public string? Password { get; set; }  // 👈 Opcional para edición
        
        public string? Rol { get; set; }
    }
}

