using System.ComponentModel.DataAnnotations;

namespace Library.Data.Entities
{
    public class Genre
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public virtual ICollection<Book> Books { get; set; } = default!;
    }
}
