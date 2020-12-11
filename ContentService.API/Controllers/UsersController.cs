using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ContentService.API.Entities;
using ContentService.API.Helpers;
using ContentService.API.Models.Users;
using ContentService.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ContentService.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private IImageService _imageService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(IUserService userService, IImageService imageService, IMapper mapper,IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _imageService = imageService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Authenticate([FromBody] AuthenticateModel model)
        {
            var response = _userService.Authenticate(model, ipAddress());

            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            setTokenCookie(response.RefreshToken);
            var imagePath = _imageService.GetProfilePath(response.Id.ToString());
            string userIMG = "";
            if(!string.IsNullOrEmpty(imagePath))
            {
                userIMG = $"http://tupla.sytes.net:5000/{imagePath}";
            }
            Console.WriteLine("User " + response.Username + "Logged In " + DateTime.Now.ToString());
            var user = new
            {
                response.Id,
                response.Username,
                response.FirstName,
                response.LastName,
                response.Email,
                response.Birthdate,
                response.PhoneNumber,
                response.Role,
                userIMG
            };
            return Ok(new {
                user,
                response.Token
            });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // accept token from request body or cookie
            var token = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            var response = _userService.RevokeToken(token, ipAddress());

            if (!response)
                return NotFound(new { message = "Token not found" });

            return Ok(new { message = "Logout Successful!" });
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = _userService.RefreshToken(refreshToken, ipAddress());

            if (response == null)
                return Unauthorized(new { message = "Invalid token" });

            setTokenCookie(response.RefreshToken);

            return Ok(response);
        }

        [HttpPost("revoke-token")]
        public IActionResult RevokeToken([FromBody] RevokeTokenRequest model)
        {
            // accept token from request body or cookie
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            var response = _userService.RevokeToken(token, ipAddress());

            if (!response)
                return NotFound(new { message = "Token not found" });

            return Ok(new { message = "Token revoked" });
        }

        [HttpGet("{id}/refresh-tokens")]
        public IActionResult GetRefreshTokens(int id)
        {
            var user = _userService.GetById(id);
            if (user == null) return NotFound();

            return Ok(user.RefreshTokens);
        }

        // helper methods
        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string ipAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            // map model to entity
            var user = _mapper.Map<User>(model);

            try
            {
                // create user
                _userService.Create(user, model.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            var model = _mapper.Map<IList<UserModel>>(users);
            return Ok(model);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userService.GetById(id);
            var model = _mapper.Map<UserModel>(user);
            return Ok(model);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userService.Delete(id);
            return Ok();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("profile")]
        public IActionResult GetUserProfile()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
            var user = _userService.GetById(int.Parse(userId));
            var imagePath = _imageService.GetProfilePath(userId);
            string userIMG = "";
            if (!string.IsNullOrEmpty(imagePath))
            {
                userIMG = $"http://tupla.sytes.net:5000/{imagePath}";
            }
            return Ok(new
            {
                user.Id,
                user.Username,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Birthdate,
                user.PhoneNumber,
                userIMG
            });
        }

        [HttpPost]
        [Route("EditProfile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        //POST : /api/UserProfile/
        public async Task<Object> EditUserProfile([FromForm] EditProfile newData)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
            var oldData = _userService.GetById(int.Parse(userId));
            try
            {
                if (!oldData.Email.Equals(newData.Email) && !string.IsNullOrWhiteSpace(newData.Email))
                    oldData.Email = newData.Email;
                if (!oldData.Username.Equals(newData.Username) && !string.IsNullOrWhiteSpace(newData.Username))
                {
                    if (_userService.GetByUsername(newData.Username) != null)
                        throw new AppException("Username \"" + newData.Username + "\" is already taken");
                    oldData.Username = newData.Username;
                }
                if (!oldData.Password.Equals(newData.Password) && !string.IsNullOrWhiteSpace(newData.Password))
                    oldData.Password = newData.Password;
                if (!oldData.FirstName.Equals(newData.Firstname) && !string.IsNullOrWhiteSpace(newData.Firstname))
                    oldData.FirstName = newData.Firstname;
                if (!oldData.LastName.Equals(newData.Lastname) && !string.IsNullOrWhiteSpace(newData.Lastname))
                    oldData.LastName = newData.Lastname;
                if (!oldData.Birthdate.Equals(newData.Birthdate) && newData.Birthdate != DateTime.MinValue)
                    oldData.Birthdate = newData.Birthdate;
                if (!oldData.PhoneNumber.Equals(newData.PhoneNumber) && !string.IsNullOrWhiteSpace(newData.PhoneNumber))
                    oldData.PhoneNumber = newData.PhoneNumber;
                if (newData.Image != null)
                {
                    try
                    {
                        string subPath = "UserProfile";
                        if (_imageService.ImageCheck(userId))
                        {
                            string path = _imageService.GetProfilePath(userId);
                            _imageService.DeleteImage(path);
                            _imageService.RemoveFromDB(userId);
                        }
                        string UserProfileFileName = $"UPF_{userId}_{DateTime.Now.Ticks.ToString()}.png";
                        await _imageService.UploadImageAsync(newData.Image, subPath, UserProfileFileName);
                        UserImage userIMG = new UserImage();
                        userIMG.imgName = UserProfileFileName;
                        userIMG.userId = int.Parse(userId);
                        _imageService.AddToDB(userIMG);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                _userService.Update(oldData);
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
            return Ok();
        }
    }
}