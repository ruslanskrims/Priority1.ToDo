namespace Priority1.ToDo.Core.Domain;

public class Todo : EntityBase
{
    public bool IsComplete { get; set; } = false;
    public int TodoListId { get; set; }
    public TodoList TodoList { get; set; } = null!;
    public DateOnly? DueDate { get; set; }
}