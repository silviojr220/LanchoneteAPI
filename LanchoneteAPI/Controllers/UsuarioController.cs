using LanchoneteAPI.DTOs;
using LanchoneteAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    // Armazenamento em memória enquanto não há banco
    private static readonly Dictionary<string, Usuario> _usuarios = new()
    {
        // Conta admin padrão
        ["admin@email.com"] = new Usuario
        {
            Id = 1,
            Email = "admin@email.com",
            Senha = "123",
            Perfil = "ADM"
        }
    };

    private static int _proximoId = 2;

    public UsuarioController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO dto)
    {
        if (!_usuarios.TryGetValue(dto.Email, out var usuario))
            return Unauthorized(new { mensagem = "Email ou senha inválidos" });

        if (usuario.Senha != dto.Senha)
            return Unauthorized(new { mensagem = "Email ou senha inválidos" });

        var token = GerarToken(usuario);
        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult Cadastrar([FromBody] CadastroDTO dto)
    {
        if (_usuarios.ContainsKey(dto.Email))
            return Conflict(new { mensagem = "Email já cadastrado" });

        var usuario = new Usuario
        {
            Id = _proximoId++,
            Email = dto.Email,
            Senha = dto.Senha,
            Perfil = "CLIENTE"
        };

        _usuarios[dto.Email] = usuario;

        return Ok(new
        {
            mensagem = "Usuário criado com sucesso",
            usuario.Email
        });
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
                new Claim(ClaimTypes.Role, usuario.Perfil) // usa o perfil real do usuário
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