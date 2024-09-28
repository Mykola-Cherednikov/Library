using System.ComponentModel.DataAnnotations;

namespace Library.Model
{
    public class GenreModel
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }
    }
}
