using Library.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Library.Data
{
    public class LibraryDBContext : DbContext
    {
        public LibraryDBContext(DbContextOptions<LibraryDBContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }

        public DbSet<Genre> Genres { get; set; }

        public DbSet<Author> Authors { get; set; }

        public DbSet<User> Users { get; set; }
    }
}
