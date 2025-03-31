namespace SimpleInvoice_Api.Models.Auth
{
    public class CreateUsuarioDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string UsuarioNombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Rol { get; set; } = "User";
    }
}
