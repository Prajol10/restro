using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RestroApi.Models
{
    public class MenuCategory
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        [ForeignKey("RestaurantId")] public Restaurant? Restaurant { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}
