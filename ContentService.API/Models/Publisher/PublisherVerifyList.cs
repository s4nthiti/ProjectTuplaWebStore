using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Models.Publisher
{
    public class PublisherVerifyList
    {
        public int publisherId { get; set; }
        public string publisherName { get; set; }
        public int userId { get; set; }
    }
}
