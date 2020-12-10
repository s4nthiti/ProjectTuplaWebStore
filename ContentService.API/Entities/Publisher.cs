using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Entities
{
    public class Publisher
    {
        [Required]
        public int publisherId { get; set; }
        public string publisherName { get; set; }
        public string streetAddress { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postal { get; set; }
        public string country { get; set; }
        public bool verify { get; set; }
        public int verifyBy { get; set; }
        public DateTime verifyDate { get; set; }
        public int userId { get; set; }
        public User User { get; set; }
    }
}
