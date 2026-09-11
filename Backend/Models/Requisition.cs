using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Requisition
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal EstimatedAmount { get; set; }
    public Priority Priority { get; set; }
    public Status Status { get; set; } = Status.Pendiente;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;
    
    public string? AdminComments { get; set; }
}