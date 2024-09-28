using Library.Data;
using Library.Data.Entities;
using Library.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BooksController : ControllerBase
    {
        private readonly LibraryDBContext _context;

        public BooksController(LibraryDBContext context)
        {
            _context = context;

            context.Books.Include(x => x.Authors).Include(x => x.Genres).ToList();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookModel>>> GetBooks()
        {
            List<BookModel> bookModels = new();
            List<Book> books = await _context.Books.ToListAsync();

            foreach (var book in books)
            {
                BookModel bookModel = ConvertBookToBookModel(book);

                bookModels.Add(bookModel);
            }

            return bookModels;
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<BookModel>> Get(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            BookModel bookModel = ConvertBookToBookModel(book);

            return bookModel;
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> Edit(BookInputModel bookModel)
        {
            if (!await _context.Books.AnyAsync(x => x.Id == bookModel.Id))
            {
                return NotFound();
            }

            Book book = (await _context.Books.FindAsync(bookModel.Id))!;
            await EnterDataFromBookInputModelToBook(book, bookModel);

            _context.Update(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("Create")]
        public async Task<ActionResult<BookModel>> Create(BookInputModel bookInputModel)
        {
            Book book = await ConvertBookInputModelToBook(bookInputModel);

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            BookModel bookModel = ConvertBookToBookModel(book);

            return CreatedAtAction("Get", new { id = bookModel.Id }, bookModel);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private BookModel ConvertBookToBookModel(Book book)
        {
            BookModel bookModel = new BookModel()
            {
                Id = book.Id,
                Name = book.Name,
                PublishDate = book.PublishDate,
                Authors = new List<AuthorModel>(),
                Genres = new List<GenreModel>()
            };

            foreach (var genre in book.Genres)
            {
                GenreModel genreModel = new GenreModel()
                {
                    Id = genre.Id,
                    Name = genre.Name
                };

                bookModel.Genres.Add(genreModel);
            }

            foreach (var author in book.Authors)
            {
                var authorModel = new AuthorModel()
                {
                    Id = author.Id,
                    FullName = author.FullName,
                    BirthDate = author.BirthDate
                };

                bookModel.Authors.Add(authorModel);
            }


            return bookModel;
        }

        private async Task<Book> ConvertBookInputModelToBook(BookInputModel bookModel)
        {
            Book book = new Book()
            {
                Id = bookModel.Id,
                Name = bookModel.Name,
                PublishDate = bookModel.PublishDate,
                Authors = new List<Author>(),
                Genres = new List<Genre>()
            };

            foreach (var idGenre in bookModel.IdGenres)
            {
                Genre genre = (await _context.Genres.FindAsync(idGenre))!;

                book.Genres.Add(genre);
            }

            foreach (var idAuthor in bookModel.IdAuthors)
            {
                Author author = (await _context.Authors.FindAsync(idAuthor))!;

                book.Authors.Add(author);
            }

            return book;
        }

        private async Task EnterDataFromBookInputModelToBook(Book book, BookInputModel bookModel)
        {
            book.Id = bookModel.Id;
            book.Name = bookModel.Name;
            book.PublishDate = bookModel.PublishDate;
            book.Authors = new List<Author>();
            book.Genres = new List<Genre>();


            foreach (var idGenre in bookModel.IdGenres)
            {
                Genre genre = (await _context.Genres.FindAsync(idGenre))!;

                book.Genres.Add(genre);
            }

            foreach (var idAuthor in bookModel.IdAuthors)
            {
                Author author = (await _context.Authors.FindAsync(idAuthor))!;

                book.Authors.Add(author);
            }
        }
    }
}
