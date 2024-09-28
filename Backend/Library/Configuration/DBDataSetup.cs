using Library.Data;
using Library.Data.Entities;

namespace Library.Configuration
{
    public static class DBDataSetup
    {
        public static void DataSetup(this WebApplication webApp)
        {
            using (var scope = webApp.Services.CreateScope())
            {
                using (var appContext = scope.ServiceProvider.GetRequiredService<LibraryDBContext>())
                {
                    if (appContext.Users.Count() != 0)
                    {
                        return;
                    }

                    appContext.Users.Add(new User()
                    {
                        Login = "admin",
                        Password = "admin"
                    });

                    appContext.Genres.Add(new Genre()
                    {
                        Name = "Фантастика"
                    });

                    appContext.Genres.Add(new Genre()
                    {
                        Name = "Детективи"
                    });

                    appContext.Genres.Add(new Genre()
                    {
                        Name = "Любовні романи"
                    });

                    appContext.Authors.Add(new Author()
                    {
                        FullName = "Іванов Андрій Олексійович",
                        BirthDate = new DateOnly(1985, 5, 12)
                    });

                    appContext.Authors.Add(new Author()
                    {
                        FullName = "Петренко Олександр Іванович",
                        BirthDate = new DateOnly(1978, 8, 24)
                    });

                    appContext.Authors.Add(new Author()
                    {
                        FullName = "Сергієнко Дмитро Володимирович",
                        BirthDate = new DateOnly(1990, 3, 5)
                    });

                    appContext.SaveChanges();

                    appContext.Books.Add(new Book()
                    {
                        Name = "Таємниці нічного міста",
                        PublishDate = new DateOnly(2021, 11, 15),
                        Authors = new List<Author>() { appContext.Authors.Find(1)! },
                        Genres = new List<Genre>() { appContext.Genres.Find(1)!, appContext.Genres.Find(3)! }
                    });

                    appContext.Books.Add(new Book()
                    {
                        Name = "Коли серце співає",
                        PublishDate = new DateOnly(2019, 4, 22),
                        Authors = new List<Author>() { appContext.Authors.Find(2)!, appContext.Authors.Find(3)! },
                        Genres = new List<Genre>() { appContext.Genres.Find(3)! }
                    });

                    appContext.Books.Add(new Book()
                    {
                        Name = "Загублені вітрила кохання",
                        PublishDate = new DateOnly(2023, 7, 30),
                        Authors = new List<Author>() { appContext.Authors.Find(3)! },
                        Genres = new List<Genre>() { appContext.Genres.Find(2)!, appContext.Genres.Find(3)! }
                    });

                    appContext.SaveChanges();
                }
            }
        }
    }
}
