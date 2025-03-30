using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleInvoice_Api.Data;
using SimpleInvoice_Api.Models;

namespace SimpleInvoice_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormaPagoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FormaPagoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FormaPago>>> GetFormasPago()
        {
            return await _context.FormasPago
                .Include(fp => fp.Factura)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FormaPago>> GetFormaPago(int id)
        {
            var formaPago = await _context.FormasPago
                .Include(fp => fp.Factura)
                .FirstOrDefaultAsync(fp => fp.Id == id);

            if (formaPago == null)
                return NotFound();

            return formaPago;
        }

        [HttpPost]
        public async Task<ActionResult<FormaPago>> PostFormaPago(FormaPago formaPago)
        {
            _context.FormasPago.Add(formaPago);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFormaPago), new { id = formaPago.Id }, formaPago);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFormaPago(int id, FormaPago formaPago)
        {
            if (id != formaPago.Id)
                return BadRequest();

            _context.Entry(formaPago).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.FormasPago.Any(fp => fp.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFormaPago(int id)
        {
            var formaPago = await _context.FormasPago.FindAsync(id);
            if (formaPago == null)
                return NotFound();

            _context.FormasPago.Remove(formaPago);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
