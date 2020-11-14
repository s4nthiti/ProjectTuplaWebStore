using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
using ContentService.API.Context;
using ContentService.API.Entities;
using ContentService.API.Helpers;
using ContentService.API.Models.Contents;
using ContentService.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContentService.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        private DataContext _context;

        public ContentController(DataContext context)
        {
            _context = context;
        }

        /*[AllowAnonymous]
        [HttpGet("posts")]
        public async Task<Object> GetLastTenPosts()
        {
            var allPost = await _context.Posts.Where(p => p.published == true).OrderBy(u => u.createDate).Take(10).ToListAsync();
            return Ok(allPost);
        }*/

        [AllowAnonymous]
        [HttpGet("posts")]
        public async Task<Object> GetPostOffset([FromQuery]int p)
        {
            int skipOffset = 10 * p;
            if (skipOffset == 0)
            {
                var allPost = await _context.Posts.Where(p => p.published == true).OrderBy(u => u.createDate).Take(10).ToListAsync();
                return Ok(allPost);
            }
            else
            {
                var allPost = await _context.Posts.Where(p => p.published == true).OrderBy(u => u.createDate).Skip(skipOffset).Take(10).ToListAsync();
                return Ok(allPost);
            }
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("post")]
        public async Task<Object> PostContent([FromBody] PostModel model)
        {
            string claimUserId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
            int userId = int.Parse(claimUserId);
            var creatorUser = await _context.Users.Where(p => p.Id == userId).FirstOrDefaultAsync();
            var post = new Post()
            {
                authorId = creatorUser.Id,
                content = model.content,
                author = $"{creatorUser.FirstName} {creatorUser.LastName}",
                createDate = DateTime.Now,
                published = false
            };
            try
            {
                _context.Add(post);
                var result = await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        [Route("post/{id}/publish")]
        public async Task<Object> PublishedPost(int id)
        {
            var getPost = await _context.Posts.FirstOrDefaultAsync(a => a.Id == id);
            if(getPost == null)
                return Ok(new { message = "Post Not Found!" });
            getPost.published = true;
            try
            {
                var result = await _context.SaveChangesAsync();
                return Ok(new { message = "Successful published post!" });
            }
            catch( Exception ex)
            {
                throw ex;
            }
        }

    }
}
