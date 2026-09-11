using Backend.Models;
namespace Backend.DTOs;
public class CreateRequisitionDto { 
    public string Title { get; set; } = string.Empty; 
    public decimal EstimatedAmount { get; set; } 
    public Priority Priority { get; set; } 
    }

public class RejectRequisitionDto { 
    public string AdminComments { get; set; } = string.Empty; 
    }