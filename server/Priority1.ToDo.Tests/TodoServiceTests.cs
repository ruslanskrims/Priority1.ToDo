using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;
using Priority1.ToDo.Core.Services;

namespace Priority1.ToDo.Tests;

public class TodoServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsTodosFromSelectedList()
    {
        await using var context = CreateContext();
        var firstList = new TodoList
        {
            Title = "Work"
        };

        var secondList = new TodoList
        {
            Title = "Home"
        };

        context.TodoList.AddRange(firstList, secondList);
        await context.SaveChangesAsync();

        context.Todos.AddRange(
            new Todo
            {
                Title = "Work todo",
                TodoListId = firstList.Id
            },
            new Todo
            {
                Title = "Home todo",
                TodoListId = secondList.Id
            }
        );

        await context.SaveChangesAsync();

        var service = new TodoService(context);
        var result = await service.GetAllAsync(firstList.Id);

        Assert.Single(result);
        Assert.Equal("Work todo", result[0].Title);
        Assert.Equal(firstList.Id, result[0].TodoListId);
    }

    [Fact]
    public async Task CreateAsync_SavesTodoWithDueDate()
    {
        await using var context = CreateContext();

        var list = new TodoList
        {
            Title = "Study"
        };

        context.TodoList.Add(list);
        await context.SaveChangesAsync();

        var service = new TodoService(context);
        var dueDate = new DateOnly(2026, 10, 10);
        var todo = new Todo
        {
            Title = "Complete assignment",
            TodoListId = list.Id,
            DueDate = dueDate
        };
        var result = await service.CreateAsync(todo);

        Assert.NotEqual(0, result.Id);
        Assert.Equal("Complete assignment", result.Title);
        Assert.Equal(list.Id, result.TodoListId);
        Assert.Equal(dueDate, result.DueDate);
        var savedTodo = await context.Todos.FindAsync(result.Id);
        Assert.NotNull(savedTodo);
        Assert.Equal(dueDate, savedTodo.DueDate);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesTodoFields()
    {
        await using var context = CreateContext();

        var list = new TodoList
        {
            Title = "Work"
        };

        context.TodoList.Add(list);
        await context.SaveChangesAsync();

        var todo = new Todo
        {
            Title = "Old title",
            IsComplete = false,
            TodoListId = list.Id,
            DueDate = new DateOnly(2026, 10, 5)
        };
        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        var service = new TodoService(context);
        var updatedTodo = new Todo
        {
            Id = todo.Id,
            Title = "New title",
            IsComplete = true,
            DueDate = new DateOnly(2026, 10, 15)
        };

        var result = await service.UpdateAsync(updatedTodo);

        Assert.NotNull(result);
        Assert.Equal("New title", result.Title);
        Assert.True(result.IsComplete);
        Assert.Equal(new DateOnly(2026, 10, 15), result.DueDate);
        Assert.Equal(list.Id, result.TodoListId);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenTodoDoesNotExist()
    {
        await using var context = CreateContext();

        var service = new TodoService(context);

        var todo = new Todo
        {
            Id = 999,
            Title = "Does not exist"
        };

        var result = await service.UpdateAsync(todo);
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesTodo()
    {
        await using var context = CreateContext();

        var list = new TodoList
        {
            Title = "Work"
        };

        context.TodoList.Add(list);
        await context.SaveChangesAsync();

        var todo = new Todo
        {
            Title = "Delete me",
            TodoListId = list.Id
        };

        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        var service = new TodoService(context);
        var result = await service.DeleteAsync(todo.Id);

        Assert.True(result);
        Assert.Null(await context.Todos.FindAsync(todo.Id));
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenTodoDoesNotExist()
    {
        await using var context = CreateContext();

        var service = new TodoService(context);
        var result = await service.DeleteAsync(999);

        Assert.False(result);
    }
}