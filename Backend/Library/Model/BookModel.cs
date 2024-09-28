using System.ComponentModel.DataAnnotations;

namespace Library.Model
{
    public class BookModel
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public DateOnly PublishDate { get; set; }

        [Required]
        public ICollection<GenreModel> Genres { get; set; } = default!;

        [Required]
        public ICollection<AuthorModel> Authors { get; set; } = default!;
    }
}
