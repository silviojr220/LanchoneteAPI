namespace LanchoneteAPI.Models;

public class Pedido
{
    public int Id { get; set; }
    public List<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
    public decimal Total { get; set; }
}