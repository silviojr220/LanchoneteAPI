using Microsoft.AspNetCore.Mvc;
using LanchoneteAPI.Models;
using LanchoneteAPI.Services;

namespace LanchoneteAPI.Controllers;

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
    public async Task<ActionResult<IEnumerable<Produto>>> Get()
    {
        var produtos = await _service.GetAll();
        return Ok(produtos);
    }

    // GET: api/produto/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Produto>> Get(int id)
    {
        var produto = await _service.GetById(id);

        if (produto == null)
            return NotFound();

        return Ok(produto);
    }

    // POST: api/produto
    [HttpPost]
    public async Task<ActionResult<Produto>> Post(Produto produto)
    {
        var novoProduto = await _service.Add(produto);

        return CreatedAtAction(nameof(Get), new { id = novoProduto.Id }, novoProduto);
    }

    // PUT: api/produto/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Produto produto)
    {
        try
        {
            await _service.Update(id, produto);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE: api/produto/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.Delete(id);
        return NoContent();
    }
}