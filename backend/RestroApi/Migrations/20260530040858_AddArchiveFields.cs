using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RestroApi.Migrations
{
    /// <inheritdoc />
    public partial class AddArchiveFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "MenuItems",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "MenuItems",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "GalleryImages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "GalleryImages",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "GalleryImages");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "GalleryImages");
        }
    }
}
