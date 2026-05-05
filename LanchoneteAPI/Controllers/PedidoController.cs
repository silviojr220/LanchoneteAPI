using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LanchoneteAPI.Services;
using LanchoneteAPI.DTOs;

namespace LanchoneteAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidoController : ControllerBase
    {
        private readonly IPedidoService _service;

        public PedidoController(IPedidoService service)
        {
            _service = service;
        }

        // POST: api/pedido
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CriarPedido([FromBody] PedidoDTO dto)
        {
            try
            {
                if (dto == null || dto.Itens == null || !dto.Itens.Any())
                {
                    return BadRequest(new
                    {
                        sucesso = false,
                        mensagem = "Pedido deve conter pelo menos um item"
                    });
                }

                var pedido = await _service.CriarPedido(dto);

                return Ok(new
                {
                    sucesso = true,
                    dados = pedido
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    sucesso = false,
                    erro = ex.Message
                });
            }
        }

        // GET: api/pedido
        [HttpGet]
        [Authorize(Roles = "ADM")]
        public async Task<IActionResult> GetTodos()
        {
            try
            {
                var pedidos = await _service.GetAll();

                return Ok(new
                {
                    sucesso = true,
                    dados = pedidos
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    sucesso = false,
                    erro = ex.Message
                });
            }
        }

        // GET: api/pedido/1
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var pedido = await _service.GetById(id);

                if (pedido == null)
                {
                    return NotFound(new
                    {
                        sucesso = false,
                        mensagem = "Pedido não encontrado"
                    });
                }

                return Ok(new
                {
                    sucesso = true,
                    dados = pedido
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    sucesso = false,
                    erro = ex.Message
                });
            }
        }
    }
}