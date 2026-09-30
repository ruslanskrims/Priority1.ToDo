using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Core.Services;

public class TodoListService : ITodoListService
{
    private readonly AppDbContext _dbContext;
    public TodoListService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TodoList>> GetAllAsync(CancellationToken ct = default)
    {
        return await _dbContext.TodoList.ToListAsync(ct);
    }

    public async Task<TodoList?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.TodoList.FirstOrDefaultAsync(tl => tl.Id == id, ct);
    }

    public async Task<TodoList> CreateAsync(TodoList tList, CancellationToken ct = default)
    {
        _dbContext.TodoList.Add(tList);
        await _dbContext.SaveChangesAsync(ct);
        return tList;
    }

    public async Task<TodoList?> UpdateAsync(TodoList tList, CancellationToken ct = default)
    {
        var list = await _dbContext.TodoList.FirstOrDefaultAsync(tl => tl.Id == tList.Id, ct);
        
        if (list is null)
        {
            return null;
        }

        list.Title = tList.Title;
        await _dbContext.SaveChangesAsync(ct);
        return list;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var list = await _dbContext.TodoList.FirstOrDefaultAsync(tl => tl.Id == id, ct);
        
        if (list is null)
        {
            return false;
        }

        _dbContext.TodoList.Remove(list);
        await _dbContext.SaveChangesAsync(ct);
        return true;
    }
}