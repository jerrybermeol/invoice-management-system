using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleInvoice_Api.Data;
using SimpleInvoice_Api.Models;
using SimpleInvoice_Api.Models.DTOs;

namespace SimpleInvoice_Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FacturasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FacturasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Facturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacturaDto>>> GetFacturas()
        {
            var facturas = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .Include(f => f.Detalles)
                .Include(f => f.FormasPago)
                .Select(f => new FacturaDto
                {
                    Id = f.Id,
                    ClienteNombre = f.Cliente.Nombre,
                    UsuarioNombre = f.Usuario.Nombre,
                    Fecha = f.Fecha,
                    Total = f.Total,
                    Detalles = f.Detalles.Select(d => new DetalleFacturaDto
                    {
                        ProductoId = d.ProductoId,
                        Cantidad = d.Cantidad,
                        PrecioUnitario = d.PrecioUnitario,
                        Subtotal = d.Subtotal
                    }).ToList(),
                    FormasPago = f.FormasPago.Select(p => new FormaPagoDto
                    {
                        Metodo = p.Metodo,
                        Monto = p.Monto
                    }).ToList()
                })
                .ToListAsync();

            return Ok(facturas);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<FacturaDto>> GetFacturaPorId(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .Include(f => f.Detalles)
                .Include(f => f.FormasPago)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null)
                return NotFound();

            var facturaDto = new FacturaDto
            {
                Id = factura.Id,
                ClienteNombre = factura.Cliente?.Nombre,
                UsuarioNombre = factura.Usuario?.Nombre,
                Fecha = factura.Fecha,
                Total = factura.Total,
                Detalles = factura.Detalles.Select(d => new DetalleFacturaDto
                {
                    ProductoId = d.ProductoId,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Subtotal = d.Subtotal
                }).ToList(),
                FormasPago = factura.FormasPago.Select(fp => new FormaPagoDto
                {
                    Metodo = fp.Metodo,
                    Monto = fp.Monto
                }).ToList()
            };

            return Ok(facturaDto);
        }



        // POST: api/Facturas
        [HttpPost]
        public async Task<ActionResult<FacturaDto>> CrearFactura(FacturaCreateDto facturaDto)
        {
            var factura = new Factura
            {
                ClienteId = facturaDto.ClienteId,
                UsuarioId = facturaDto.UsuarioId,
                Fecha = facturaDto.Fecha,
                Total = facturaDto.Total,
                FechaAgregado = DateTime.Now,
                Detalles = facturaDto.Detalles.Select(d => new DetalleFactura
                {
                    ProductoId = d.ProductoId,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Subtotal = d.Subtotal
                }).ToList(),
                FormasPago = facturaDto.FormasPago.Select(f => new FormaPago
                {
                    Metodo = f.Metodo,
                    Monto = f.Monto
                }).ToList()
            };

            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();

            // 🔄 Mapear a FacturaDto (sin relaciones cíclicas)
            var dto = new FacturaDto
            {
                Id = factura.Id,
                ClienteNombre = (await _context.Clientes.FindAsync(factura.ClienteId))?.Nombre ?? "Desconocido",
                UsuarioNombre = (await _context.Usuarios.FindAsync(factura.UsuarioId))?.Nombre ?? "Desconocido",
                Fecha = factura.Fecha,
                Total = factura.Total,
                Detalles = factura.Detalles.Select(d => new DetalleFacturaDto
                {
                    ProductoId = d.ProductoId,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Subtotal = d.Subtotal
                }).ToList(),
                FormasPago = factura.FormasPago.Select(f => new FormaPagoDto
                {
                    Metodo = f.Metodo,
                    Monto = f.Monto
                }).ToList()
            };

            return CreatedAtAction(nameof(GetFacturaPorId), new { id = dto.Id }, dto);
        }



        // PUT: api/Facturas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFactura(int id, Factura factura)
        {
            if (id != factura.Id)
                return BadRequest();

            _context.Entry(factura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacturaExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Facturas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFactura(int id)
        {
            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
                return NotFound();

            _context.Facturas.Remove(factura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FacturaExists(int id)
        {
            return _context.Facturas.Any(e => e.Id == id);
        }

    }
}
