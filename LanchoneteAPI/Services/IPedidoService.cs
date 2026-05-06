namespace LanchoneteAPI.Services;

using LanchoneteAPI.DTOs;
using LanchoneteAPI.Models;

public interface IPedidoService
{
    Task<Pedido> CriarPedido(PedidoDTO dto);
    Task<List<Pedido>> GetAll();
    Task<Pedido> GetById(int id);
    Task<List<Pedido>> ListOrders();
}