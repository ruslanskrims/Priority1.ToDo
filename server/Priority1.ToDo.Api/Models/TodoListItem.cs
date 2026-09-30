using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

public class TodoListItem
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public DateTime CreateDate { get; set; }

    public DateTime UpdateDate { get; set; }

    public static TodoListItem From(TodoList todoList)
    {
        return new TodoListItem
        {
            Id = todoList.Id,
            Title = todoList.Title,
            CreateDate = todoList.CreateDate,
            UpdateDate = todoList.UpdateDate
        };
    }
}