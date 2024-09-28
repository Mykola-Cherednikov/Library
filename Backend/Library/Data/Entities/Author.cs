using System.ComponentModel.DataAnnotations;

namespace Library.Data.Entities
{
    public class Author
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? FullName { get; set; }

        [Required]
        public DateOnly BirthDate { get; set; }

        public virtual ICollection<Book> Books { get; set; } = default!;
    }
}
