using Microsoft.AspNetCore.Mvc;
using LanchoneteAPI.Services;
using LanchoneteAPI.Models;
using LanchoneteAPI.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace LanchoneteAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly IProdutoService _service;

        public ProdutoController(IProdutoService service)
        {
            _service = service;
        }

        // GET: api/produto
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var produtos = await _service.GetAll();
                return Ok(new { sucesso = true, dados = produtos });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, erro = ex.Message });
            }
        }

        // GET: api/produto/1
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var produto = await _service.GetById(id);

                if (produto == null)
                    return NotFound(new { sucesso = false, mensagem = "Produto não encontrado" });

                return Ok(new { sucesso = true, dados = produto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, erro = ex.Message });
            }
        }

        // POST: api/produto
        [HttpPost]
        [Authorize(Roles = "ADM,SUPERADM")]
        public async Task<IActionResult> Post([FromBody] ProdutoDTO dto)
        {
            try
            {
                var produto = new Produto
                {
                    Nome = dto.Nome,
                    Tipo = dto.Tipo,
                    Preco = dto.Preco
                };

                var result = await _service.Add(produto);
                return Ok(new { sucesso = true, dados = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, erro = ex.Message });
            }
        }

        // PUT: api/produto/1
        [HttpPut("{id}")]
        [Authorize(Roles = "ADM,SUPERADM")]
        public async Task<IActionResult> Put(int id, [FromBody] ProdutoDTO dto)
        {
            try
            {
                var produto = new Produto
                {
                    Id = id,
                    Nome = dto.Nome,
                    Tipo = dto.Tipo,
                    Preco = dto.Preco
                };

                await _service.Update(id, produto);
                return Ok(new { sucesso = true, mensagem = "Produto atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, erro = ex.Message });
            }
        }

        // DELETE: api/produto/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADM,SUPERADM")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.Delete(id);
                return Ok(new { sucesso = true, mensagem = "Produto removido com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, erro = ex.Message });
            }
        }
    }
}