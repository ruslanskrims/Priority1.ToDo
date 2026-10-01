using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;
using Priority1.ToDo.Core.Services;

namespace Priority1.ToDo.Tests;

public class TodoListServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ReturnsNewTodoList()
    {
        await using var context = CreateContext();

        var service = new TodoListService(context);

        var list = new TodoList
        {
            Title = "Work"
        };

        var result = await service.CreateAsync(list);

        Assert.NotEqual(0, result.Id);
        Assert.Equal("Work", result.Title);

        var savedList = await context.TodoList.FindAsync(result.Id);

        Assert.NotNull(savedList);
        Assert.Equal("Work", savedList.Title);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllTodoLists()
    {
        await using var context = CreateContext();

        context.TodoList.AddRange(
            new TodoList
            {
                Title = "Work"
            },
            new TodoList
            {
                Title = "Home"
            }
        );

        await context.SaveChangesAsync();

        var service = new TodoListService(context);
        var result = await service.GetAllAsync();

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsChangedTodoListTitle()
    {
        await using var context = CreateContext();

        var list = new TodoList
        {
            Title = "Old name"
        };

        context.TodoList.Add(list);
        await context.SaveChangesAsync();

        var service = new TodoListService(context);
        var updatedList = new TodoList
        {
            Id = list.Id,
            Title = "New name"
        };

        var result = await service.UpdateAsync(updatedList);

        Assert.NotNull(result);
        Assert.Equal("New name", result.Title);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenTodoListDoesNotExist()
    {
        await using var context = CreateContext();

        var service = new TodoListService(context);
        var list = new TodoList
        {
            Id = 999,
            Title = "Missing"
        };

        var result = await service.UpdateAsync(list);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_RemovesTodoList()
    {
        await using var context = CreateContext();

        var list = new TodoList
        {
            Title = "Todo to Delete"
        };

        context.TodoList.Add(list);
        await context.SaveChangesAsync();

        var service = new TodoListService(context);

        var result = await service.DeleteAsync(list.Id);

        Assert.True(result);
        Assert.Null(await context.TodoList.FindAsync(list.Id));
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenTodoListDoesNotExist()
    {
        await using var context = CreateContext();

        var service = new TodoListService(context);
        var result = await service.DeleteAsync(999);

        Assert.False(result);
    }
}