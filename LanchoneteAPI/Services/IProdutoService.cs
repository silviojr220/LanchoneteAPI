using LanchoneteAPI.Models;

namespace LanchoneteAPI.Services;

public interface IProdutoService
{
    Task<List<Produto>> GetAll();
    Task<Produto> GetById(int id);
    Task<Produto> Add(Produto produto);
    Task Update(int id, Produto produto);
    Task Delete(int id);
}
