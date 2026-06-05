using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestroApi.Data;
using RestroApi.Models;

namespace RestroApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminController(AppDbContext context) { _context = context; }

        private int? GetRestaurantId()
        {
            var claim = User.FindFirst("RestaurantId")?.Value;
            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int id)) return null;
            return id;
        }

        // Restaurant Info
        [HttpGet("restaurant")]
        public async Task<IActionResult> GetRestaurant()
        {
            var id = GetRestaurantId();
            if (id == null) return Unauthorized();
            var r = await _context.Restaurants.FindAsync(id);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPut("restaurant")]
        public async Task<IActionResult> UpdateRestaurant([FromBody] UpdateRestaurantDto dto)
        {
            var id = GetRestaurantId();
            if (id == null) return Unauthorized();
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
            r.AboutText = dto.AboutText != null ? dto.AboutText : r.AboutText;
            r.AboutShort = dto.AboutShort != null ? dto.AboutShort : r.AboutShort;
            r.AboutImageUrl = dto.AboutImageUrl != null ? dto.AboutImageUrl : r.AboutImageUrl;
            r.ReservationText = dto.ReservationText != null ? dto.ReservationText : r.ReservationText;
            r.Address = dto.Address != null ? dto.Address : r.Address;
            r.Phone = dto.Phone != null ? dto.Phone : r.Phone;
            r.Email = dto.Email != null ? dto.Email : r.Email;
            r.OpeningHours = dto.OpeningHours != null ? dto.OpeningHours : r.OpeningHours;
            r.FacebookUrl = dto.FacebookUrl != null ? dto.FacebookUrl : r.FacebookUrl;
            r.InstagramUrl = dto.InstagramUrl != null ? dto.InstagramUrl : r.InstagramUrl;
            r.TiktokUrl = dto.TiktokUrl != null ? dto.TiktokUrl : r.TiktokUrl;
            r.MapEmbedUrl = dto.MapEmbedUrl != null ? dto.MapEmbedUrl : r.MapEmbedUrl;
            await _context.SaveChangesAsync();
            return Ok(r);
        }

        // Menu Categories
        [HttpGet("menu-categories")]
        public async Task<IActionResult> GetCategories()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.MenuCategories.Where(c => c.RestaurantId == id).OrderBy(c => c.SortOrder).ToListAsync());
        }

        [HttpPost("menu-categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var cat = new MenuCategory { RestaurantId = id.Value, Name = dto.Name, Description = dto.Description, SortOrder = dto.SortOrder, IsActive = true };
            _context.MenuCategories.Add(cat);
            await _context.SaveChangesAsync();
            return Ok(cat);
        }

        [HttpPut("menu-categories/{catId}")]
        public async Task<IActionResult> UpdateCategory(int catId, [FromBody] CategoryDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var cat = await _context.MenuCategories.FirstOrDefaultAsync(c => c.Id == catId && c.RestaurantId == id);
            if (cat == null) return NotFound();
            cat.Name = dto.Name ?? cat.Name;
            cat.Description = dto.Description ?? cat.Description;
            cat.SortOrder = dto.SortOrder;
            cat.IsActive = dto.IsActive ?? cat.IsActive;
            await _context.SaveChangesAsync();
            return Ok(cat);
        }

        [HttpDelete("menu-categories/{catId}")]
        public async Task<IActionResult> DeleteCategory(int catId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var cat = await _context.MenuCategories.FirstOrDefaultAsync(c => c.Id == catId && c.RestaurantId == id);
            if (cat == null) return NotFound();
            _context.MenuCategories.Remove(cat);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Menu Items
        [HttpGet("menu-items")]
        public async Task<IActionResult> GetMenuItems()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.MenuItems.Where(i => i.RestaurantId == id).OrderBy(i => i.SortOrder).ToListAsync());
        }

        [HttpPost("menu-items")]
        public async Task<IActionResult> CreateMenuItem([FromBody] MenuItemDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = new MenuItem
            {
                RestaurantId = id.Value, CategoryId = dto.CategoryId,
                Name = dto.Name, Subtitle = dto.Subtitle, Description = dto.Description,
                Price = dto.Price, ImageUrl = dto.ImageUrl,
                IsSpecial = dto.IsSpecial, IsAvailable = dto.IsAvailable, SortOrder = dto.SortOrder
            };
            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("menu-items/{itemId}")]
        public async Task<IActionResult> UpdateMenuItem(int itemId, [FromBody] MenuItemDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = await _context.MenuItems.FirstOrDefaultAsync(i => i.Id == itemId && i.RestaurantId == id);
            if (item == null) return NotFound();
            item.CategoryId = dto.CategoryId;
            item.Name = dto.Name ?? item.Name;
            item.Subtitle = dto.Subtitle ?? item.Subtitle;
            item.Description = dto.Description ?? item.Description;
            item.Price = dto.Price;
            item.ImageUrl = dto.ImageUrl != null ? dto.ImageUrl : item.ImageUrl;
            item.IsSpecial = dto.IsSpecial;
            item.IsAvailable = dto.IsAvailable;
            item.SortOrder = dto.SortOrder;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("menu-items/{itemId}")]
        public async Task<IActionResult> DeleteMenuItem(int itemId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = await _context.MenuItems.FirstOrDefaultAsync(i => i.Id == itemId && i.RestaurantId == id);
            if (item == null) return NotFound();
            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Orders
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.Orders.Where(o => o.RestaurantId == id).OrderByDescending(o => o.CreatedAt).ToListAsync());
        }

        [HttpPut("orders/{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] StatusDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.RestaurantId == id);
            if (order == null) return NotFound();
            order.Status = dto.Status;
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // Reservations
        [HttpGet("reservations")]
        public async Task<IActionResult> GetReservations()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.Reservations.Where(r => r.RestaurantId == id).OrderByDescending(r => r.CreatedAt).ToListAsync());
        }

        [HttpPut("reservations/{resId}/status")]
        public async Task<IActionResult> UpdateReservationStatus(int resId, [FromBody] StatusDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var res = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == resId && r.RestaurantId == id);
            if (res == null) return NotFound();
            res.Status = dto.Status;
            await _context.SaveChangesAsync();
            return Ok(res);
        }

        // Reviews
        [HttpGet("reviews")]
        public async Task<IActionResult> GetReviews()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.Reviews.Where(r => r.RestaurantId == id).OrderByDescending(r => r.CreatedAt).ToListAsync());
        }

        [HttpPost("reviews")]
        public async Task<IActionResult> CreateReview([FromBody] AdminReviewDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var review = new Review
            {
                RestaurantId = id.Value, CustomerName = dto.CustomerName,
                Rating = dto.Rating, Content = dto.Content,
                Source = dto.Source ?? "admin", IsApproved = true
            };
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpPut("reviews/{reviewId}/approve")]
        public async Task<IActionResult> ApproveReview(int reviewId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.RestaurantId == id);
            if (review == null) return NotFound();
            review.IsApproved = !review.IsApproved;
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpDelete("reviews/{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.RestaurantId == id);
            if (review == null) return NotFound();
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Gallery
        [HttpGet("gallery")]
        public async Task<IActionResult> GetGallery()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.GalleryImages.Where(g => g.RestaurantId == id).OrderBy(g => g.SortOrder).ToListAsync());
        }

        [HttpPost("gallery")]
        public async Task<IActionResult> AddGalleryImage([FromBody] GalleryDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var img = new GalleryImage { RestaurantId = id.Value, ImageUrl = dto.ImageUrl, Caption = dto.Caption, SortOrder = dto.SortOrder, IsActive = true };
            _context.GalleryImages.Add(img);
            await _context.SaveChangesAsync();
            return Ok(img);
        }

        [HttpDelete("gallery/{imgId}")]
        public async Task<IActionResult> DeleteGalleryImage(int imgId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var img = await _context.GalleryImages.FirstOrDefaultAsync(g => g.Id == imgId && g.RestaurantId == id);
            if (img == null) return NotFound();
            _context.GalleryImages.Remove(img);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("gallery/{imgId}/archive")]
        public async Task<IActionResult> ArchiveGalleryImage(int imgId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var img = await _context.GalleryImages.FirstOrDefaultAsync(g => g.Id == imgId && g.RestaurantId == id);
            if (img == null) return NotFound();
            img.IsArchived = !img.IsArchived;
            img.ArchivedAt = img.IsArchived ? DateTime.UtcNow : null;
            await _context.SaveChangesAsync();
            return Ok(img);
        }

        [HttpGet("gallery/archived")]
        public async Task<IActionResult> GetArchivedGallery()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var imgs = await _context.GalleryImages
                .Where(g => g.RestaurantId == id && g.IsArchived)
                .OrderByDescending(g => g.ArchivedAt)
                .Select(g => new { g.Id, g.RestaurantId, g.ImageUrl, g.Caption, g.SortOrder, g.IsArchived, g.ArchivedAt, g.CreatedAt })
                .ToListAsync();
            return Ok(imgs);
        }

        [HttpPut("menu-items/{itemId}/archive")]
        public async Task<IActionResult> ArchiveMenuItem(int itemId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = await _context.MenuItems.FirstOrDefaultAsync(i => i.Id == itemId && i.RestaurantId == id);
            if (item == null) return NotFound();
            item.IsArchived = !item.IsArchived;
            item.ArchivedAt = item.IsArchived ? DateTime.UtcNow : null;
            item.IsAvailable = !item.IsArchived;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // Why Choose Us
        [HttpGet("why-choose-us")]
        public async Task<IActionResult> GetWhyChooseUs()
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            return Ok(await _context.WhyChooseUs.Where(w => w.RestaurantId == id).OrderBy(w => w.SortOrder).ToListAsync());
        }

        [HttpPost("why-choose-us")]
        public async Task<IActionResult> CreateWhyChooseUs([FromBody] WhyChooseUsDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = new WhyChooseUs
            {
                RestaurantId = id.Value,
                Icon = dto.Icon ?? "",
                Title = dto.Title,
                Description = dto.Description,
                SortOrder = dto.SortOrder,
                IsActive = true
            };
            _context.WhyChooseUs.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("why-choose-us/{itemId}")]
        public async Task<IActionResult> UpdateWhyChooseUs(int itemId, [FromBody] WhyChooseUsDto dto)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = await _context.WhyChooseUs.FirstOrDefaultAsync(w => w.Id == itemId && w.RestaurantId == id);
            if (item == null) return NotFound();
            item.Icon = dto.Icon ?? item.Icon;
            item.Title = dto.Title ?? item.Title;
            item.Description = dto.Description ?? item.Description;
            item.SortOrder = dto.SortOrder;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("why-choose-us/{itemId}")]
        public async Task<IActionResult> DeleteWhyChooseUs(int itemId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = await _context.WhyChooseUs.FirstOrDefaultAsync(w => w.Id == itemId && w.RestaurantId == id);
            if (item == null) return NotFound();
            _context.WhyChooseUs.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("why-choose-us/{itemId}/archive")]
        public async Task<IActionResult> ArchiveWhyChooseUs(int itemId)
        {
            var id = GetRestaurantId(); if (id == null) return Unauthorized();
            var item = await _context.WhyChooseUs.FirstOrDefaultAsync(w => w.Id == itemId && w.RestaurantId == id);
            if (item == null) return NotFound();
            item.IsActive = !item.IsActive;
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }

    public class UpdateRestaurantDto
    {
        public string? Name { get; set; }
        public string? LogoUrl { get; set; }
        public string? BannerUrl { get; set; }
        public string? VideoUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? AccentColor { get; set; }
        public string? BgColor { get; set; }
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
        public string? MapEmbedUrl { get; set; }
    }

    public class CategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool? IsActive { get; set; }
    }

    public class MenuItemDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsSpecial { get; set; } = false;
        public bool IsAvailable { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }

    public class WhyChooseUsDto
    {
        public string? Icon { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
    }

    public class StatusDto { public string Status { get; set; } = string.Empty; }
    public class GalleryDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string? Caption { get; set; }
        public int SortOrder { get; set; } = 0;
    }
    public class AdminReviewDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        public string Content { get; set; } = string.Empty;
        public string? Source { get; set; }
    }
}
