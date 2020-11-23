using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Models.Users
{
    public class EditProfile
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        [DataType(DataType.Date)]
        public DateTime Birthdate { get; set; }
        public string PhoneNumber { get; set; }
        public IFormFile Image { get; set; }
    }
}
