using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

[ApiController]
[Route("todo-list")]
public class TodoListController : ControllerBase
{
    private readonly ITodoListService _todoListService;

    public TodoListController(ITodoListService todoListService)
    {
        _todoListService = todoListService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoListItem>>> GetAll(CancellationToken ct)
    {
        var list = await _todoListService.GetAllAsync(ct);
        return Ok(list.Select(TodoListItem.From));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoListItem>> GetById(int id, CancellationToken ct)
    {
        var todoList = await _todoListService.GetByIdAsync(id, ct);
        return todoList is null ? NotFound() : Ok(TodoListItem.From(todoList));
    }

    [HttpPost]
    public async Task<ActionResult<TodoListItem>> Create([FromBody] CreateTodoListRequest request, CancellationToken ct)
    {
        var created = await _todoListService.CreateAsync(request.ToModel(), ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, TodoListItem.From(created));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoListItem>> Update(int id, [FromBody] UpdateTodoListRequest request, CancellationToken ct)
    {
        var updated = await _todoListService.UpdateAsync(request.ToModel(id), ct);
        return updated is null ? NotFound() : Ok(TodoListItem.From(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _todoListService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}