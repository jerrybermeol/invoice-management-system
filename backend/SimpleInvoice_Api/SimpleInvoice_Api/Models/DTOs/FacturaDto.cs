namespace SimpleInvoice_Api.Models.DTOs
{
    public class FacturaDto
    {
        public int Id { get; set; }
        public string ClienteNombre { get; set; }
        public string UsuarioNombre { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }

        public List<DetalleFacturaDto> Detalles { get; set; } = new();
        public List<FormaPagoDto> FormasPago { get; set; } = new();
    }
}
