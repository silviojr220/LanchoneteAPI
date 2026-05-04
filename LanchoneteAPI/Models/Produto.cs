namespace LanchoneteAPI.Models;

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Tipo { get; set; } // Lanche ou Bebida
    public decimal Preco { get; set; }
}