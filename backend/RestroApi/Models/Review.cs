using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RestroApi.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        [ForeignKey("RestaurantId")] public Restaurant? Restaurant { get; set; }
        [Required] public string CustomerName { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        public string Content { get; set; } = string.Empty;
        public string Source { get; set; } = "customer";
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
