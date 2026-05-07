using LanchoneteAPI.Data;
using LanchoneteAPI.DTOs;
using LanchoneteAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LanchoneteAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly AppDbContext _context;

    public UsuarioController(IConfiguration configuration, AppDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            return Unauthorized(new { mensagem = "Email ou senha inválidos" });

        var token = GerarToken(usuario);
        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Cadastrar([FromBody] CadastroDTO dto)
    {
        var existe = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
        if (existe)
            return Conflict(new { mensagem = "Email já cadastrado" });

        var usuario = new Usuario
        {
            Email = dto.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Telefone = dto.Telefone,
            Perfil = "CLIENTE"
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "Usuário criado com sucesso", usuario.Email });
    }

    // Só SUPERADM cria ADM
    [Authorize(Roles = "SUPERADM")]
    [HttpPost("criar-adm")]
    public async Task<IActionResult> CriarAdm([FromBody] CadastroDTO dto)
    {
        var existe = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
        if (existe)
            return Conflict(new { mensagem = "Email já cadastrado" });

        var usuario = new Usuario
        {
            Email = dto.Email,
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Perfil = "ADM"
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "ADM criado com sucesso", usuario.Email });
    }

    // Só SUPERADM lista ADMs
    [Authorize(Roles = "SUPERADM")]
    [HttpGet("adms")]
    public async Task<IActionResult> ListarAdms()
    {
        var adms = await _context.Usuarios
            .Where(u => u.Perfil == "ADM")
            .Select(u => new { u.Id, u.Email })
            .ToListAsync();

        return Ok(new { sucesso = true, dados = adms });
    }

    // Só SUPERADM remove ADM
    [Authorize(Roles = "SUPERADM")]
    [HttpDelete("adm/{id}")]
    public async Task<IActionResult> RemoverAdm(int id)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id && u.Perfil == "ADM");

        if (usuario == null)
            return NotFound(new { mensagem = "ADM não encontrado" });

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        return Ok(new { mensagem = "ADM removido com sucesso" });
    }

    private string GerarToken(Usuario usuario)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
{
    new Claim(ClaimTypes.Email, usuario.Email),
    new Claim("role", usuario.Perfil) 
}),
            Expires = DateTime.UtcNow.AddHours(2),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}