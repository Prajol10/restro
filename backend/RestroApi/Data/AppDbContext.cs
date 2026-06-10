using Microsoft.EntityFrameworkCore;
using RestroApi.Models;

namespace RestroApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuCategory> MenuCategories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<WhyChooseUs> WhyChooseUs { get; set; }
        public DbSet<Award> Awards { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Restaurant constraints
            modelBuilder.Entity<Restaurant>()
                .HasIndex(r => r.Subdomain)
                .IsUnique();

            // MenuCategory constraints
            modelBuilder.Entity<MenuCategory>()
                .HasIndex(mc => new { mc.RestaurantId, mc.Name })
                .IsUnique();

            // MenuItem constraints
            modelBuilder.Entity<MenuItem>()
                .HasIndex(mi => new { mi.RestaurantId, mi.Name })
                .IsUnique();

            // AdminUser constraints
            modelBuilder.Entity<AdminUser>()
                .HasIndex(au => au.Email)
                .IsUnique();

            // WhyChooseUs constraints
            modelBuilder.Entity<Award>()
                .HasIndex(a => new { a.RestaurantId, a.Title })
                .IsUnique();

            modelBuilder.Entity<WhyChooseUs>()
                .HasIndex(wcu => new { wcu.RestaurantId, wcu.Title })
                .IsUnique();
        }
    }
}
