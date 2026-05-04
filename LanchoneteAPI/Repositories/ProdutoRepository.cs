using LanchoneteAPI.Data;
using LanchoneteAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LanchoneteAPI.Repositories;

public class ProdutoRepository : IProdutoRepository
{
    private readonly AppDbContext _context;

    public ProdutoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Produto>> GetAll()
    {
        return await _context.Produtos.ToListAsync();
    }

    public async Task<Produto> GetById(int id)
    {
        return await _context.Produtos.FindAsync(id);
    }

    public async Task<Produto> Add(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return produto;
    }

    public async Task Update(Produto produto)
    {
        _context.Entry(produto).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto != null)
        {
            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
        }
    }
}
