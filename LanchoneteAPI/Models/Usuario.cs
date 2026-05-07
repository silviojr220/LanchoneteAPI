namespace LanchoneteAPI.Models;

public class Usuario
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Senha { get; set; }
    public string Perfil { get; set; } // ADM ou Cliente

    public string? Telefone { get; set; }
}