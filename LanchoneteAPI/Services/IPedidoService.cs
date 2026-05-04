namespace LanchoneteAPI.Services;

using LanchoneteAPI.DTOs;
using LanchoneteAPI.Models;

public interface IPedidoService
{
    Task<Pedido> CriarPedido(PedidoDTO dto);
}