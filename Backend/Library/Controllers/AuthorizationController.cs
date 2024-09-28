using Library.Configuration.Options;
using Library.Data;
using Library.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly LibraryDBContext _context;

        private readonly IConfiguration _configuration;

        public AuthorizationController(LibraryDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            try
            {
                if (await CheckCredentials(loginDTO.Login, loginDTO.Password))
                {
                    SymmetricSecurityKey secretKey;

                    secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>(JWTOptions.SecretKeyName)!));

                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                    var jwtSecurityToken = new JwtSecurityToken(
                        issuer: _configuration.GetValue<string>(JWTOptions.IssuerName)!,
                        audience: _configuration.GetValue<string>(JWTOptions.AudienceName)!,
                        claims: new List<Claim>(),
                        expires: DateTime.Now.AddDays(1),
                        signingCredentials: signinCredentials
                    );

                    TokenModel tokenModel = new TokenModel()
                    {
                        Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken)
                    };

                    return Ok(tokenModel);
                }
            }
            catch
            {
                return BadRequest("An error occurred in generating the token");
            }

            return Unauthorized();
        }

        private async Task<bool> CheckCredentials(string login, string password)
        {
            return await _context.Users.AnyAsync(u => u.Login == login && u.Password == password);    
        }

        [HttpGet("CheckToken"), Authorize]
        public IActionResult CheckToken()
        {
            return Ok();
        }
    }
}
