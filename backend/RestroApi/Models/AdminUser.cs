using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RestroApi.Models
{
    public class AdminUser
    {
        public int Id { get; set; }
        public int? RestaurantId { get; set; }
        [ForeignKey("RestaurantId")] public Restaurant? Restaurant { get; set; }
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "RestaurantAdmin";
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
