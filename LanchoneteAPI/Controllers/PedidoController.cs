using Microsoft.AspNetCore.Mvc;
using LanchoneteAPI.DTOs;
using LanchoneteAPI.Services;
using Microsoft.AspNetCore.Authorization;

namespace LanchoneteAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidoController : ControllerBase
{
    private readonly IPedidoService _service;

    public PedidoController(IPedidoService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CriarPedido(PedidoDTO dto)
    {
        var pedido = await _service.CriarPedido(dto);
        return Ok(pedido);
    }
}