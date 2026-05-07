using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LanchoneteAPI.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarTelefone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Usuarios",
                type: "varchar(15)",
                maxLength: 15,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Usuarios");
        }
    }
}