using ContentService.API.Context;
using ContentService.API.Entities;
using ContentService.API.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Services
{
    public interface IPublisherService
    {
        Task AddToDb(Publisher model);
        Task DeleteOldRequest(int id);
        Publisher GetById(int id);
        void Update(Publisher model);
        Task UpdateAsync(Publisher model);
        IEnumerable<Publisher> GetAll();
        IEnumerable<Publisher> GetAllUnverify();
    }

    public class PublisherService : IPublisherService
    {
        private DataContext _context;
        private readonly AppSettings _appSettings;
        private readonly IHostingEnvironment _hostingEnvironment;

        public PublisherService(DataContext context, IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task AddToDb(Publisher model)
        {
            if (_context.Publishers.Any(x => x.publisherName == model.publisherName))
                throw new AppException("Publisher Name \"" + model.publisherName + "\" is already taken");
            _context.Publishers.Add(model);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOldRequest(int id)
        {
            var request = _context.Publishers.SingleOrDefault(u => u.userId == id);
            if (request != null)
            {
                _context.Publishers.Remove(request);
                await _context.SaveChangesAsync();
            }
        }

        public void Update(Publisher model)
        {
            _context.Publishers.Update(model);
            _context.SaveChanges();
        }

        public async Task UpdateAsync(Publisher model)
        {
            _context.Publishers.Update(model);
            await _context.SaveChangesAsync();
        }

        public IEnumerable<Publisher> GetAll()
        {
            return _context.Publishers;
        }
        public IEnumerable<Publisher> GetAllUnverify()
        {
            return _context.Publishers.Where(x => x.verify == false);
        }

        public Publisher GetById(int id)
        {
            return _context.Publishers.Where(x => x.userId == id).FirstOrDefault();
        }

    }
}
