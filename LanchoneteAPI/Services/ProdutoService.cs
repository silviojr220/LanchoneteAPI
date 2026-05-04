using LanchoneteAPI.Models;
using LanchoneteAPI.Repositories;

namespace LanchoneteAPI.Services;

    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _repository;

        public ProdutoService(IProdutoRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Produto>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Produto> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Produto> Add(Produto produto)
        {
            return await _repository.Add(produto);
        }

        public async Task Update(int id, Produto produto)
        {
            if (id != produto.Id)
                throw new Exception("ID inválido");

            await _repository.Update(produto);
        }

        public async Task Delete(int id)
        {
            await _repository.Delete(id);
        }
    }
