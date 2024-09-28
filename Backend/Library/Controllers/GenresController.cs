using Library.Data;
using Library.Data.Entities;
using Library.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GenresController : ControllerBase
    {
        private readonly LibraryDBContext _context;

        public GenresController(LibraryDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GenreModel>>> GetGenres()
        {
            List<GenreModel> genres = new List<GenreModel>();
            (await _context.Genres.ToListAsync())
                .ForEach(x =>
                    genres.Add(
                        new()
                        {
                            Id = x.Id,
                            Name = x.Name
                        }
                    )
                );

            return genres;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<GenreModel>> Get(int id)
        {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null)
            {
                return NotFound();
            }

            var genreModel = new GenreModel()
            {
                Id = genre.Id,
                Name = genre.Name
            };

            return Ok(genreModel);
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> Edit(GenreModel genreModel)
        {
            if (!_context.Genres.Any(x => x.Id == genreModel.Id))
            {
                return NotFound();
            }

            var genre = new Genre()
            {
                Id = genreModel.Id,
                Name = genreModel.Name
            };

            _context.Update(genre);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("Create")]
        public async Task<ActionResult<GenreModel>> Create(GenreModel genreModel)
        {
            var genre = new Genre()
            {
                Name = genreModel.Name
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            var genreOutputModel = new GenreModel()
            {
                Id = genre.Id,
                Name = genre.Name
            };

            return CreatedAtAction("Get", new { id = genreOutputModel.Id }, genreOutputModel);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
            {
                return NotFound();
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
