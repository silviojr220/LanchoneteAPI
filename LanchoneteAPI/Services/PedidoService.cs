namespace LanchoneteAPI.Services;

using LanchoneteAPI.Data;
using LanchoneteAPI.DTOs;
using LanchoneteAPI.Models;
using Microsoft.EntityFrameworkCore;

public class PedidoService : IPedidoService
{
    private readonly AppDbContext _context;

    public PedidoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Pedido> CriarPedido(PedidoDTO dto)
    {
        var pedido = new Pedido();
        decimal total = 0;

        foreach (var item in dto.Itens)
        {
            var produto = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Id == item.ProdutoId);

            if (produto == null)
                throw new Exception("Produto não encontrado");

            total += produto.Preco * item.Quantidade;

            pedido.Itens.Add(new ItemPedido
            {
                ProdutoId = produto.Id,
                Quantidade = item.Quantidade
            });
        }

        pedido.Total = total;

        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();

        return pedido;
    }

    public async Task<List<Pedido>> GetAll()
    {
        return await _context.Pedidos
            .Include(p => p.Itens)
            .ThenInclude(i => i.Produto)
            .ToListAsync();
    }

    public async Task<Pedido> GetById(int id)
    {
        return await _context.Pedidos
            .Include(p => p.Itens)
            .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}