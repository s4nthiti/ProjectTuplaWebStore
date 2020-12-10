using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ContentService.API.Entities
{
    public class User
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime Birthdate { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Role { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        [JsonIgnore]
        public string Password { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; }
        public ICollection<UserImage> UserImages { get; set; }
        public ICollection<Publisher> Publishers { get; set; }
        public ICollection<IdentityCard> IdentityCards { get; set; }

        public User()
        {
            RefreshTokens = new Collection<RefreshToken>();
            UserImages = new Collection<UserImage>();
            Publishers = new Collection<Publisher>();
            IdentityCards = new Collection<IdentityCard>();
        }
    }
}
