using Library.Configuration;
using Library.Configuration.Options;
using Library.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

namespace Library
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<LibraryDBContext>(options =>
                options.UseSqlServer(builder.Configuration["ConnectionString"]));

            builder.CreateCorsPolicy();

            builder.Services.AddControllers();

            builder.AddAuthorizationWithBearer();

            builder.Services.AddEndpointsApiExplorer();
            builder.AddSwaggerGenWithBearer();

            var app = builder.Build();
            app.UseCors(CORSOptions.CORSPolicyName);
            app.MigrateDatabase();
            app.DataSetup();

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
