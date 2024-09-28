using System.ComponentModel.DataAnnotations;

namespace Library.Data.Entities
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]  
        public string? Name { get; set; }

        [Required]
        public DateOnly PublishDate { get; set; }

        [Required]
        public virtual ICollection<Author> Authors { get; set; } = default!;

        [Required]
        public virtual ICollection<Genre> Genres { get; set; } = default!;
    }
}
