using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Core.Domain;

public abstract class EntityBase
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }
}