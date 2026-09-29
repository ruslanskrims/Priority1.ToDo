using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Priority1.ToDo.Core.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Todos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsComplete = table.Column<bool>(type: "bit", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Todos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TodoList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(
                        type: "nvarchar(200)",
                        maxLength: 200,
                        nullable: false),
                    CreateDate = table.Column<DateTime>(
                        type: "datetime2",
                        nullable: false),
                    UpdateDate = table.Column<DateTime>(
                        type: "datetime2",
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoList", x => x.Id);
                });

            migrationBuilder.AddColumn<int>(
                name: "TodoListId",
                table: "Todos",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("""
            INSERT INTO [TodoList] ([Title], [CreateDate], [UpdateDate])
            VALUES ('Default', SYSUTCDATETIME(), SYSUTCDATETIME());
            """);

            migrationBuilder.Sql("""
            UPDATE [Todos]
            SET [TodoListId] = (
                SELECT TOP 1 [Id]
                FROM [TodoList]
                ORDER BY [Id]
            )
            WHERE [TodoListId] IS NULL;
            """);

            migrationBuilder.AlterColumn<int>(
                name: "TodoListId",
                table: "Todos",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TodoListId",
                table: "Todos",
                column: "TodoListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_TodoList_TodoListId",
                table: "Todos",
                column: "TodoListId",
                principalTable: "TodoList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_TodoList_TodoListId",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_TodoListId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "TodoListId",
                table: "Todos");

            migrationBuilder.DropTable(
                name: "TodoList");
        }
    }
}