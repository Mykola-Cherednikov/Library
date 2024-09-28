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
    public class AuthorsController : ControllerBase
    {
        private readonly LibraryDBContext _context;

        public AuthorsController(LibraryDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorModel>>> GetAuthors()
        {
            List<AuthorModel> authors = new List<AuthorModel>();
            (await _context.Authors.ToListAsync())
                .ForEach(x => 
                    authors.Add(
                        new() 
                        { 
                            Id = x.Id,
                            BirthDate = x.BirthDate, 
                            FullName = x.FullName
                        }
                    )
                );
            return authors;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<AuthorModel>> Get(int id)
        {
            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            var authorModel = new AuthorModel()
            {
                Id = author.Id,
                FullName = author.FullName,
                BirthDate = author.BirthDate
            };

            return authorModel;
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> Edit(AuthorModel authorModel)
        {
            if(!_context.Authors.Any(x => x.Id == authorModel.Id))
            {
                return NotFound();
            }

            var author = new Author()
            {
                Id = authorModel.Id,
                BirthDate = authorModel.BirthDate,
                FullName = authorModel.FullName
            };

            _context.Update(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("Create")]
        public async Task<ActionResult<AuthorModel>> Create(AuthorModel authorModel)
        {
            var author = new Author()
            {
                FullName = authorModel.FullName,
                BirthDate = authorModel.BirthDate
            };

            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            AuthorModel authorOutputModel = new AuthorModel()
            {
                Id = author.Id,
                FullName = author.FullName,
                BirthDate = author.BirthDate,
            };

            return CreatedAtAction("Get", new { id = authorOutputModel.Id }, authorOutputModel);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
