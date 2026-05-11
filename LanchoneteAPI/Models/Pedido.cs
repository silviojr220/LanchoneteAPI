namespace LanchoneteAPI.Models;

public class Pedido
{
    public int Id { get; set; }
    public List<ItemPedido> Itens { get; set; } = new();
    public decimal Total { get; set; }

    public string Status { get; set; } = "EmPreparo";

    public DateTime DataCriacao { get; set; } = DateTime.Now;
}