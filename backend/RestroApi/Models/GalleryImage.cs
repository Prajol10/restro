using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RestroApi.Models
{
    public class GalleryImage
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        [ForeignKey("RestaurantId")] public Restaurant? Restaurant { get; set; }
        [Required] public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsArchived { get; set; } = false;
        public DateTime? ArchivedAt { get; set; }
    }
}
