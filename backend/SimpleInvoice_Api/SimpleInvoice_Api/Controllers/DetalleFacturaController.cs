using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleInvoice_Api.Data;
using SimpleInvoice_Api.Models;

namespace SimpleInvoice_Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DetalleFacturaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DetalleFacturaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleFactura>>> GetDetalles()
        {
            return await _context.DetallesFactura
                .Include(d => d.Factura)
                .Include(d => d.Producto)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleFactura>> GetDetalle(int id)
        {
            var detalle = await _context.DetallesFactura
                .Include(d => d.Factura)
                .Include(d => d.Producto)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (detalle == null)
                return NotFound();

            return detalle;
        }

        [HttpPost]
        public async Task<ActionResult<DetalleFactura>> PostDetalle(DetalleFactura detalle)
        {
            _context.DetallesFactura.Add(detalle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetalle), new { id = detalle.Id }, detalle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalle(int id, DetalleFactura detalle)
        {
            if (id != detalle.Id)
                return BadRequest();

            _context.Entry(detalle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DetallesFactura.Any(d => d.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalle(int id)
        {
            var detalle = await _context.DetallesFactura.FindAsync(id);
            if (detalle == null)
                return NotFound();

            _context.DetallesFactura.Remove(detalle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
