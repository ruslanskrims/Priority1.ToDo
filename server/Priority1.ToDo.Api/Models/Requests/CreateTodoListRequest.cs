using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodoListRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    public TodoList ToModel()
    {
        return new TodoList
        {
            Title = Title
        };
    }
}