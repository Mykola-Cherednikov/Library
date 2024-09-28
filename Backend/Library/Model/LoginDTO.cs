using System.ComponentModel.DataAnnotations;

namespace Library.Model
{
    public class LoginDTO
    {
        [Required]
        public string Login { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;
    }
}
