using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RestroApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        [ForeignKey("RestaurantId")] public Restaurant? Restaurant { get; set; }
        [Required] public string CustomerName { get; set; } = string.Empty;
        [Required] public string CustomerPhone { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string Items { get; set; } = "[]";
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
