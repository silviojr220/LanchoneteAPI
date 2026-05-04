using LanchoneteAPI.Models;

namespace LanchoneteAPI.Repositories;

public interface IProdutoRepository
{
    Task<List<Produto>> GetAll();
    Task<Produto> GetById(int id);
    Task<Produto> Add(Produto produto);
    Task Update(Produto produto);
    Task Delete(int id);
}