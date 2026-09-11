namespace Backend.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; }
    
    public ICollection<Requisition> Requisitions { get; set; } = new List<Requisition>();
}