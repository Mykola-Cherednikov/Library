using System.ComponentModel.DataAnnotations;

namespace Library.Model
{
    public class BookInputModel
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public DateOnly PublishDate { get; set; }

        [Required]
        public ICollection<int> IdGenres { get; set; } = default!;

        [Required]
        public ICollection<int> IdAuthors { get; set; } = default!;
    }
}
