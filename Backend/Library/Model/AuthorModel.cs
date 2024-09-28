using System.ComponentModel.DataAnnotations;

namespace Library.Model
{
    public class AuthorModel
    {
        public int Id { get; set; }

        [Required]
        public string? FullName { get; set; }

        [Required]
        public DateOnly BirthDate { get; set; }
    }
}
