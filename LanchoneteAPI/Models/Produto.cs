using System.ComponentModel.DataAnnotations;

namespace LanchoneteAPI.Models;

public class Produto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório")]
    public string Nome { get; set; }

    [Required]
    public string Tipo { get; set; } //Lanhe ou Bebida

    [Range(0.01, 1000, ErrorMessage = "Preço inválido")]
    public decimal Preco { get; set; }

    public string Descricao { get; set; }

    public string? ImagemUrl { get; set; }
}