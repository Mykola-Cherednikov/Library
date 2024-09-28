using Library.Configuration.Options;
using Library.Data;

namespace Library.Configuration
{
    public static class CORSManager
    {
        public static void CreateCorsPolicy(this WebApplicationBuilder builder)
        {
            var CORSConfig = builder.Configuration.GetSection(CORSOptions.CORSSectionName);

            string[] corsURLs = CORSConfig.Value!.Split(',');

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: CORSOptions.CORSPolicyName,
                      policy =>
                      {
                          policy.WithOrigins(corsURLs)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                      });
            });
        }
    }
}
