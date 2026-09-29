namespace Priority1.ToDo.Core.Domain
{
    public class TodoList : EntityBase
    {
        public ICollection<Todo> TodoItems { get; set; } = [];
    }
}
