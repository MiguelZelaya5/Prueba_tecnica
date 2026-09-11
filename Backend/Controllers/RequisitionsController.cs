using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RequisitionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequisitionsController(AppDbContext context) => _context = context;

    private int GetCurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string GetCurrentUserRole() => User.FindFirstValue(ClaimTypes.Role)!;

    [HttpGet]
   public async Task<IActionResult> Get([FromQuery] Status? status, [FromQuery] Priority? priority)
{
    var query = _context.Requisitions.Include(r => r.Creator).AsQueryable();

    if (GetCurrentUserRole() == "Empleado")
        query = query.Where(r => r.CreatorId == GetCurrentUserId());

    if (status.HasValue) query = query.Where(r => r.Status == status.Value);
    if (priority.HasValue) query = query.Where(r => r.Priority == priority.Value);

    var requisitions = await query
        .OrderByDescending(r => r.CreatedAt)
        .Select(r => new 
        {
            r.Id,
            r.Code,
            r.Title,
            Creator = r.Creator.Username, 
            EstimatedAmount = r.EstimatedAmount, // Restablecido al nombre original
            r.Priority,
            r.Status,
            CreatedAt = r.CreatedAt,             // Restablecido al nombre original
            r.AdminComments
        })
        .ToListAsync();

    return Ok(requisitions);
}

    [HttpPost]
    [Authorize(Roles = "Empleado")]
    public async Task<IActionResult> Create([FromBody] CreateRequisitionDto dto)
    {
        if (dto.EstimatedAmount <= 0)
            return BadRequest("El monto debe ser mayor a 0.");

        var currentYear = DateTime.UtcNow.Year;
        var count = await _context.Requisitions.CountAsync(r => r.CreatedAt.Year == currentYear);
        var code = $"REQ-{currentYear}-{(count + 1):D3}";

        var requisition = new Requisition
        {
            Code = code,
            Title = dto.Title,
            EstimatedAmount = dto.EstimatedAmount,
            Priority = dto.Priority,
            CreatorId = GetCurrentUserId()
        };

        _context.Requisitions.Add(requisition);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = requisition.Id }, requisition);
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> Approve(int id)
    {
        var req = await _context.Requisitions.FindAsync(id);
        if (req == null) return NotFound();

        req.Status = Status.Aprobado;
        await _context.SaveChangesAsync();
        return Ok(req);
    }

    [HttpPatch("{id}/reject")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectRequisitionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.AdminComments))
            return BadRequest("Debe ingresar un comentario de rechazo.");

        var req = await _context.Requisitions.FindAsync(id);
        if (req == null) return NotFound();

        req.Status = Status.Rechazado;
        req.AdminComments = dto.AdminComments;
        await _context.SaveChangesAsync();
        return Ok(req);
    }
}