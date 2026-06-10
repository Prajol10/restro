using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RestroApi.Models
{
    public class Award
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RestaurantId { get; set; }

        [Required]
        [StringLength(50)]
        public string Icon { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Organization { get; set; }

        [StringLength(20)]
        public string? Year { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        [JsonIgnore]
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
