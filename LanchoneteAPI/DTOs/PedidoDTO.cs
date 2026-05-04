namespace LanchoneteAPI.DTOs;

public class PedidoDTO
{
    public List<ItemPedidoDTO> Itens { get; set; }
}

public class ItemPedidoDTO
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
}