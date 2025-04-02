namespace SimpleInvoice_Api.Models.DTOs
{
    public class FacturaCreateDto
    {
        public int ClienteId { get; set; }
        public int UsuarioId { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }

        public List<DetalleFacturaDto> Detalles { get; set; }
        public List<FormaPagoDto> FormasPago { get; set; }
    }
}
