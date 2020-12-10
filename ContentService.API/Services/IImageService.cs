using ContentService.API.Context;
using ContentService.API.Entities;
using ContentService.API.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Services
{
    public interface IImageService
    {
        Task UploadImageAsync(IFormFile Image, string subPath, string FileName);
        void DeleteImage(string subPath);
        bool ImageCheck(string userID);
        bool IdentityCheck(string userID);
        void AddToDB(UserImage model);
        void RemoveFromDB(string userID);
        void AddIdentityToDB(IdentityCard model);
        void RemoveIdentityFromDB(string userID);
        string GetProfilePath(string userID);
        string GetIdentityPath(string userID);

    }

    public class ImageService : IImageService
    {
        private DataContext _context;
        private readonly AppSettings _appSettings;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ImageService(DataContext context, IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task UploadImageAsync(IFormFile Image, string subPath, string FileName)
        {
            string path = Path.Combine(_hostingEnvironment.WebRootPath, "Images/" + subPath + "/" + FileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await Image.CopyToAsync(stream);
            }
        }

        public void DeleteImage(string subPath)
        {
            string path = Path.Combine(_hostingEnvironment.WebRootPath, subPath);
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        public bool ImageCheck(string userID)
        {
            if (_context.UserImages.Where(a => a.userId == int.Parse(userID)).Any())
                return true;
            else
                return false;
        }

        public bool IdentityCheck(string userID)
        {
            if (_context.IdentityCards.Where(a => a.userId == int.Parse(userID)).Any())
                return true;
            else
                return false;
        }

        public void AddToDB(UserImage model)
        {
            _context.UserImages.Add(model);
            _context.SaveChanges();
        }

        public void RemoveFromDB(string userID)
        {
            var userImage = _context.UserImages.Where(a => a.userId == int.Parse(userID)).FirstOrDefault();
            _context.UserImages.Remove(userImage);
            _context.SaveChanges();
        }

        public void AddIdentityToDB(IdentityCard model)
        {
            _context.IdentityCards.Add(model);
            _context.SaveChanges();
        }

        public void RemoveIdentityFromDB(string userID)
        {
            var userImage = _context.IdentityCards.Where(a => a.userId == int.Parse(userID)).FirstOrDefault();
            _context.IdentityCards.Remove(userImage);
            _context.SaveChanges();
        }

        public string GetProfilePath(string userID)
        {
            var user = _context.UserImages.Where(a => a.userId == int.Parse(userID)).FirstOrDefault();
            string path = "";
            if (user != null)
                path = $"Images/UserProfile/{user.imgName}";
            return path;
        }

        public string GetIdentityPath(string userID)
        {
            var user = _context.IdentityCards.Where(a => a.userId == int.Parse(userID)).FirstOrDefault();
            string path = "";
            if (user != null)
                path = $"Images/IdentityCard/{user.imgName}";
            return path;
        }

    }
}
