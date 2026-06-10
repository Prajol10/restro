using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestroApi.Data;
using RestroApi.Models;

namespace RestroApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuperAdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public SuperAdminController(AppDbContext context, IConfiguration config)
        { _context = context; _config = config; }

        [HttpGet("restaurants")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.Restaurants.OrderByDescending(r => r.CreatedAt).ToListAsync();
            return Ok(list);
        }

        [HttpPost("restaurants")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateRestaurantDto dto)
        {
            if (await _context.Restaurants.AnyAsync(r => r.Subdomain == dto.Subdomain.ToLower()))
                return BadRequest("Subdomain already exists");

            var restaurant = new Restaurant
            {
                Name = dto.Name, Subdomain = dto.Subdomain.ToLower(),
                LogoUrl = dto.LogoUrl, BannerUrl = dto.BannerUrl, VideoUrl = dto.VideoUrl,
                PrimaryColor = !string.IsNullOrEmpty(dto.PrimaryColor) ? dto.PrimaryColor : "#1a1a1a",
                AccentColor = !string.IsNullOrEmpty(dto.AccentColor) ? dto.AccentColor : "#C9A84C",
                BgColor = !string.IsNullOrEmpty(dto.BgColor) ? dto.BgColor : "#0d0d0d",
                Tagline = dto.Tagline, HeroTitle = dto.HeroTitle,
                Address = dto.Address, Phone = dto.Phone, Email = dto.Email,
                FacebookUrl = dto.FacebookUrl, InstagramUrl = dto.InstagramUrl,
                TiktokUrl = dto.TiktokUrl, OpeningHours = dto.OpeningHours,
                MapEmbedUrl = dto.MapEmbedUrl
            };
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            // Seed default WhyChooseUs items
            var defaults = new List<WhyChooseUs>
            {
                new WhyChooseUs { RestaurantId = restaurant.Id, Icon = "🍽️", Title = "Authentic Flavors", Description = "Every dish is crafted with authentic recipes passed down through generations, bringing you the true taste of our cuisine.", SortOrder = 0, IsActive = true },
                new WhyChooseUs { RestaurantId = restaurant.Id, Icon = "🌱", Title = "Fresh Ingredients", Description = "We source only the freshest, locally-grown ingredients daily to ensure every meal is of the highest quality.", SortOrder = 1, IsActive = true },
                new WhyChooseUs { RestaurantId = restaurant.Id, Icon = "👨‍🍳", Title = "Expert Chefs", Description = "Our team of experienced chefs brings passion and expertise to every plate, turning simple ingredients into extraordinary meals.", SortOrder = 2, IsActive = true },
                new WhyChooseUs { RestaurantId = restaurant.Id, Icon = "⭐", Title = "Exceptional Service", Description = "We pride ourselves on warm, attentive service that makes every visit a memorable dining experience.", SortOrder = 3, IsActive = true }
            };
            _context.WhyChooseUs.AddRange(defaults);
            await _context.SaveChangesAsync();

            return Ok(restaurant);
        }

        [HttpPut("restaurants/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateRestaurantDto dto)
        {
            var r = await _context.Restaurants.FindAsync(id);
            if (r == null) return NotFound();
            r.Name = dto.Name ?? r.Name;
            r.LogoUrl = dto.LogoUrl != null ? dto.LogoUrl : r.LogoUrl;
            r.BannerUrl = dto.BannerUrl != null ? dto.BannerUrl : r.BannerUrl;
            r.VideoUrl = dto.VideoUrl != null ? dto.VideoUrl : r.VideoUrl;
            r.PrimaryColor = !string.IsNullOrEmpty(dto.PrimaryColor) ? dto.PrimaryColor : r.PrimaryColor;
            r.AccentColor = !string.IsNullOrEmpty(dto.AccentColor) ? dto.AccentColor : r.AccentColor;
            r.BgColor = !string.IsNullOrEmpty(dto.BgColor) ? dto.BgColor : r.BgColor;
            r.Tagline = dto.Tagline != null ? dto.Tagline : r.Tagline;
            r.HeroTitle = dto.HeroTitle != null ? dto.HeroTitle : r.HeroTitle;
            r.HeroSubtitle = dto.HeroSubtitle != null ? dto.HeroSubtitle : r.HeroSubtitle;
            r.Address = dto.Address != null ? dto.Address : r.Address;
            r.Phone = dto.Phone != null ? dto.Phone : r.Phone;
            r.Email = dto.Email != null ? dto.Email : r.Email;
            r.FacebookUrl = dto.FacebookUrl != null ? dto.FacebookUrl : r.FacebookUrl;
            r.InstagramUrl = dto.InstagramUrl != null ? dto.InstagramUrl : r.InstagramUrl;
            r.TiktokUrl = dto.TiktokUrl != null ? dto.TiktokUrl : r.TiktokUrl;
            r.OpeningHours = dto.OpeningHours != null ? dto.OpeningHours : r.OpeningHours;
            r.MapEmbedUrl = dto.MapEmbedUrl != null ? dto.MapEmbedUrl : r.MapEmbedUrl;
            r.IsActive = dto.IsActive ?? r.IsActive;
            await _context.SaveChangesAsync();
            return Ok(r);
        }

        [HttpDelete("restaurants/{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Toggle(int id)
        {
            var r = await _context.Restaurants.FindAsync(id);
            if (r == null) return NotFound();
            r.IsActive = !r.IsActive;
            await _context.SaveChangesAsync();
            return Ok(r);
        }

        [HttpPost("restaurants/{id}/admin")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> CreateAdmin(int id, [FromBody] CreateAdminDto dto)
        {
            var r = await _context.Restaurants.FindAsync(id);
            if (r == null) return NotFound("Restaurant not found");
            if (await _context.AdminUsers.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
                return BadRequest("Email already exists");
            var admin = new AdminUser
            {
                RestaurantId = id, Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "RestaurantAdmin", IsActive = true
            };
            _context.AdminUsers.Add(admin);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Admin created successfully" });
        }

        // Backfill default WhyChooseUs for existing restaurants that have none
        [HttpPost("restaurants/{id}/seed-why-choose-us")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> SeedWhyChooseUs(int id)
        {
            var r = await _context.Restaurants.FindAsync(id);
            if (r == null) return NotFound();
            if (await _context.WhyChooseUs.AnyAsync(w => w.RestaurantId == id))
                return BadRequest("Already has Why Choose Us items");
            var defaults = new List<WhyChooseUs>
            {
                new WhyChooseUs { RestaurantId = id, Icon = "🍽️", Title = "Authentic Flavors", Description = "Every dish is crafted with authentic recipes passed down through generations, bringing you the true taste of our cuisine.", SortOrder = 0, IsActive = true },
                new WhyChooseUs { RestaurantId = id, Icon = "🌱", Title = "Fresh Ingredients", Description = "We source only the freshest, locally-grown ingredients daily to ensure every meal is of the highest quality.", SortOrder = 1, IsActive = true },
                new WhyChooseUs { RestaurantId = id, Icon = "👨‍🍳", Title = "Expert Chefs", Description = "Our team of experienced chefs brings passion and expertise to every plate, turning simple ingredients into extraordinary meals.", SortOrder = 2, IsActive = true },
                new WhyChooseUs { RestaurantId = id, Icon = "⭐", Title = "Exceptional Service", Description = "We pride ourselves on warm, attentive service that makes every visit a memorable dining experience.", SortOrder = 3, IsActive = true }
            };
            _context.WhyChooseUs.AddRange(defaults);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Seeded 4 default items" });
        }

        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
        {
            if (await _context.AdminUsers.AnyAsync(u => u.Role == "SuperAdmin"))
                return BadRequest("SuperAdmin already exists");
            var superAdmin = new AdminUser
            {
                Email = "superadmin@restro.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("SuperAdmin@123"),
                Role = "SuperAdmin", IsActive = true
            };
            _context.AdminUsers.Add(superAdmin);
            await _context.SaveChangesAsync();
            return Ok(new { message = "SuperAdmin created", email = "superadmin@restro.com", password = "SuperAdmin@123" });
        }
    }

    public class CreateRestaurantDto
    {
        public string Name { get; set; } = string.Empty;
        public string Subdomain { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public string? VideoUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? AccentColor { get; set; }
        public string? BgColor { get; set; }
        public string? Tagline { get; set; }
        public string? HeroTitle { get; set; }
        public string? HeroSubtitle { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? TiktokUrl { get; set; }
        public string? OpeningHours { get; set; }
        public string? MapEmbedUrl { get; set; }
        public bool? IsActive { get; set; }
    }

    public class CreateAdminDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
