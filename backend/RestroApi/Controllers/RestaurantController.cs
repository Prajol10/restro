using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestroApi.Data;
using RestroApi.Models;

namespace RestroApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RestaurantController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Restaurant/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants()
        {
            return await _context.Restaurants
                .Where(r => r.IsActive)
                .ToListAsync();
        }

        // GET: api/Restaurant/{subdomain}
        [HttpGet("{subdomain}")]
        public async Task<ActionResult<Restaurant>> GetRestaurant(string subdomain)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            return restaurant;
        }

        // GET: api/Restaurant/{subdomain}/menu-categories
        [HttpGet("{subdomain}/menu-categories")]
        public async Task<ActionResult<IEnumerable<MenuCategory>>> GetMenuCategories(string subdomain)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            return await _context.MenuCategories
                .Where(mc => mc.RestaurantId == restaurant.Id && mc.IsActive)
                .OrderBy(mc => mc.SortOrder)
                .ToListAsync();
        }

        // GET: api/Restaurant/{subdomain}/menu-items
        [HttpGet("{subdomain}/menu-items")]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems(string subdomain)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            return await _context.MenuItems
                .Where(mi => mi.RestaurantId == restaurant.Id && mi.IsAvailable && !mi.IsArchived)
                .OrderBy(mi => mi.CategoryId)
                .ThenBy(mi => mi.SortOrder)
                .ToListAsync();
        }

        // GET: api/Restaurant/{subdomain}/gallery
        [HttpGet("{subdomain}/gallery")]
        public async Task<ActionResult<IEnumerable<GalleryImage>>> GetGallery(string subdomain)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            return await _context.GalleryImages
                .Where(g => g.RestaurantId == restaurant.Id && g.IsActive && !g.IsArchived)
                .OrderBy(g => g.SortOrder)
                .ToListAsync();
        }

        // GET: api/Restaurant/{subdomain}/reviews
        [HttpGet("{subdomain}/reviews")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(string subdomain)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            return await _context.Reviews
                .Where(r => r.RestaurantId == restaurant.Id && r.IsApproved)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // POST: api/Restaurant/{subdomain}/orders
        [HttpPost("{subdomain}/orders")]
        public async Task<ActionResult<Order>> CreateOrder(string subdomain, Order order)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            order.RestaurantId = restaurant.Id;
            order.Status = "Pending";
            order.CreatedAt = DateTime.UtcNow;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRestaurant), new { subdomain = subdomain }, order);
        }

        // POST: api/Restaurant/{subdomain}/reservations
        [HttpPost("{subdomain}/reservations")]
        public async Task<ActionResult<Reservation>> CreateReservation(string subdomain, Reservation reservation)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            reservation.RestaurantId = restaurant.Id;
            reservation.Status = "Pending";
            reservation.CreatedAt = DateTime.UtcNow;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRestaurant), new { subdomain = subdomain }, reservation);
        }

        // POST: api/Restaurant/{subdomain}/reviews
        [HttpPost("{subdomain}/reviews")]
        public async Task<ActionResult<Review>> CreateReview(string subdomain, Review review)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            review.RestaurantId = restaurant.Id;
            review.Source = "customer";
            review.IsApproved = false; // Requires admin approval
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRestaurant), new { subdomain = subdomain }, review);
        }

        // GET: api/Restaurant/{subdomain}/why-choose-us
        [HttpGet("{subdomain}/why-choose-us")]
        public async Task<ActionResult<IEnumerable<WhyChooseUs>>> GetWhyChooseUs(string subdomain)
        {
            var restaurant = await _context.Restaurants
                .Where(r => r.Subdomain == subdomain && r.IsActive)
                .FirstOrDefaultAsync();

            if (restaurant == null)
            {
                return NotFound();
            }

            return await _context.WhyChooseUs
                .Where(w => w.RestaurantId == restaurant.Id && w.IsActive)
                .OrderBy(w => w.SortOrder)
                .ToListAsync();
        }
    }
}
