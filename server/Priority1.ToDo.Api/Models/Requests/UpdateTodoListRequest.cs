using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class UpdateTodoListRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    public TodoList ToModel(int id)
    {
        return new TodoList
        {
            Id = id,
            Title = Title
        };
    }
}