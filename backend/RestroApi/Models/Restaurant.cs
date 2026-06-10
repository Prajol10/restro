using System.ComponentModel.DataAnnotations;
namespace RestroApi.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public string Subdomain { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public string? VideoUrl { get; set; }
        public string PrimaryColor { get; set; } = "#1a1a1a";
        public string AccentColor { get; set; } = "#C9A84C";
        public string BgColor { get; set; } = "#0d0d0d";
        public string TextColor { get; set; } = "#ffffff";
        public string? Tagline { get; set; }
        public string? HeroTitle { get; set; }
        public string? HeroSubtitle { get; set; }
        public string? AboutText { get; set; }
        public string? AboutShort { get; set; }
        public string? AboutImageUrl { get; set; }
        public string? ReservationText { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? OpeningHours { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? TiktokUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? MapEmbedUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<MenuCategory> MenuCategories { get; set; } = new List<MenuCategory>();
        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();
        public ICollection<AdminUser> AdminUsers { get; set; } = new List<AdminUser>();
        public ICollection<Award> Awards { get; set; } = new List<Award>();
    }
}
