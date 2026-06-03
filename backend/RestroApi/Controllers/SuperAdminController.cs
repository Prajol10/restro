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
                PrimaryColor = dto.PrimaryColor ?? "#1a1a1a",
                AccentColor = dto.AccentColor ?? "#C9A84C",
                BgColor = dto.BgColor ?? "#0d0d0d",
                Tagline = dto.Tagline, HeroTitle = dto.HeroTitle,
                Address = dto.Address, Phone = dto.Phone, Email = dto.Email,
                FacebookUrl = dto.FacebookUrl, InstagramUrl = dto.InstagramUrl,
                TiktokUrl = dto.TiktokUrl, OpeningHours = dto.OpeningHours,
                MapEmbedUrl = dto.MapEmbedUrl
            };
            _context.Restaurants.Add(restaurant);
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
            r.PrimaryColor = dto.PrimaryColor ?? r.PrimaryColor;
            r.AccentColor = dto.AccentColor ?? r.AccentColor;
            r.BgColor = dto.BgColor ?? r.BgColor;
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
