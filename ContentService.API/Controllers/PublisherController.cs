using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using ContentService.API.Entities;
using ContentService.API.Models.Publisher;
using ContentService.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PublisherController : ControllerBase
    {
        private IUserService _userService;
        private IImageService _imageService;
        private IPublisherService _publisherService;
        private IMapper _mapper;

        public PublisherController(IMapper mapper, IUserService userService, IImageService imageService, IPublisherService publisherService)
        {
            _mapper = mapper;
            _imageService = imageService;
            _userService = userService;
            _publisherService = publisherService;
        }

        [Authorize(Roles = Role.User)]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("register")]
        public async Task<Object> Register([FromForm] PublisherModel model)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
            var oldData = _publisherService.GetById(int.Parse(userId));
            if (oldData != null)
            {
                try
                {
                    oldData.publisherName = model.publisherName;
                    oldData.streetAddress = model.streetAddress;
                    oldData.city = model.city;
                    oldData.state = model.state;
                    oldData.postal = model.postal;
                    oldData.country = model.country;
                    if (_imageService.IdentityCheck(userId))
                    {
                        string path = _imageService.GetIdentityPath(userId);
                        _imageService.DeleteImage(path);
                        _imageService.RemoveIdentityFromDB(userId);
                    }
                    string IdentityCardFileName = $"IDC_{userId}_{DateTime.Now.Ticks.ToString()}.png";
                    string subPath = "IdentityCard";
                    await _imageService.UploadImageAsync(model.Image, subPath, IdentityCardFileName);
                    IdentityCard idcIMG = new IdentityCard();
                    idcIMG.imgName = IdentityCardFileName;
                    idcIMG.userId = int.Parse(userId);
                    _imageService.AddIdentityToDB(idcIMG);
                    await _publisherService.UpdateAsync(oldData);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                try
                {
                    Publisher newModel = new Publisher();
                    newModel.verify = false;
                    newModel.verifyBy = 0;
                    newModel.userId = int.Parse(userId);
                    newModel.publisherName = model.publisherName;
                    newModel.streetAddress = model.streetAddress;
                    newModel.city = model.city;
                    newModel.state = model.state;
                    newModel.postal = model.postal;
                    newModel.country = model.country;
                    string IdentityCardFileName = $"IDC_{userId}_{DateTime.Now.Ticks.ToString()}.png";
                    string subPath = "IdentityCard";
                    await _imageService.UploadImageAsync(model.Image, subPath, IdentityCardFileName);
                    IdentityCard idcIMG = new IdentityCard();
                    idcIMG.imgName = IdentityCardFileName;
                    idcIMG.userId = int.Parse(userId);
                    _imageService.AddIdentityToDB(idcIMG);
                    await _publisherService.AddToDb(newModel);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return Ok();
        }

        [Authorize(Roles = Role.Admin)]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        public IActionResult GetAll()
        {
            var request = _publisherService.GetAllUnverify();
            List<PublisherVerifyList> result = new List<PublisherVerifyList>();
            foreach (var item in request)
            {
                PublisherVerifyList addItem = new PublisherVerifyList();
                addItem.publisherId = item.publisherId;
                addItem.publisherName = item.publisherName;
                addItem.userId = item.userId;
                result.Add(addItem);
            }
            return Ok(result);
        }

        [Authorize(Roles = Role.Admin)]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var request = _publisherService.GetById(id);
            var model = _mapper.Map<Publisher>(request);
            string userId = model.userId.ToString();
            var user = _userService.GetById(int.Parse(userId));
            var imagePath = _imageService.GetIdentityPath(userId);
            string identityCard = "";
            if (!string.IsNullOrEmpty(imagePath))
            {
                identityCard = $"http://tupla.sytes.net:5000/{imagePath}";
            }
            return Ok(new
            {
                user.FirstName,
                user.LastName,
                user.PhoneNumber,
                user.Email,
                request.publisherId,
                request.publisherName,
                request.streetAddress,
                request.city,
                request.state,
                request.postal,
                request.country,
                identityCard
            });
        }

        [Authorize(Roles = Role.Admin)]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("verify/{id}")]
        public IActionResult Verify(int id)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var verifyId = claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
            var request = _publisherService.GetById(id);
            string userId = request.userId.ToString();
            var oldData = _userService.GetById(int.Parse(userId));
            try
            {
                request.verify = true;
                request.verifyBy = int.Parse(verifyId);
                request.verifyDate = DateTime.Now;
                oldData.Role = Role.Seller;
                _publisherService.Update(request);
                _userService.Update(oldData);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Ok();
        }

    }
}
