using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SimpleInvoice_Api.Data;
using SimpleInvoice_Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SimpleInvoice_Api.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using SimpleInvoice_Api.Models.DTOs;



namespace SimpleInvoice_Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public UsuariosController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            return usuario;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] SimpleInvoice_Api.Models.Auth.LoginRequest request)
        {            

            var user = _context.Usuarios.FirstOrDefault(u => u.UsuarioNombre == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Credenciales incorrectas");
            }
            // Leer la configuración
            var jwtConfig = _configuration.GetSection("Jwt");

            // Leer la clave secreta desde variable de entorno o user-secrets
            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? jwtConfig["Key"];

            if (string.IsNullOrEmpty(secretKey))
                return StatusCode(500, "JWT_SECRET_KEY no está definida");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UsuarioNombre),
                //new Claim(ClaimTypes.Role, user.Rol ?? "User")
                new Claim(ClaimTypes.Role, user.Rol)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtConfig["Issuer"],
                audience: jwtConfig["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtConfig["ExpiresInMinutes"])),
                signingCredentials: creds
            );


            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = tokenString });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> PostUsuario([FromBody] CreateUsuarioDto dto)
        {
            // Verificar si ya existe el nombre de usuario o email
            var existeUsuario = await _context.Usuarios
                .AnyAsync(u => u.UsuarioNombre == dto.UsuarioNombre || u.Email == dto.Email);

            if (existeUsuario)
                return BadRequest("El nombre de usuario o email ya está registrado.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                UsuarioNombre = dto.UsuarioNombre,
                Email = dto.Email,
                Password = hashedPassword,                
                Rol = dto.Rol ?? "user",
                FechaAgregado = DateTime.Now
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> PutUsuario(int id, [FromBody] UsuarioUpdateDto usuario)
        {
            if (id != usuario.Id)
                return BadRequest("El ID de la URL no coincide con el ID del usuario.");

            var usuarioExistente = await _context.Usuarios.FindAsync(id);
            if (usuarioExistente == null)
                return NotFound("Usuario no encontrado.");

            // Actualiza los campos que deseas permitir modificar
            usuarioExistente.Nombre = usuario.Nombre;
            usuarioExistente.UsuarioNombre = usuario.UsuarioNombre;
            usuarioExistente.Email = usuario.Email;
            //usuarioExistente.Rol = usuario.Rol;

            // Si deseas actualizar contraseña, hazlo aparte (opcional)
            if (!string.IsNullOrEmpty(usuario.Password))
            {
                usuarioExistente.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }

    }
}
