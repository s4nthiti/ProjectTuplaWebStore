using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Entities
{
    public class Post
    {
        public long Id { get; set; }
        public int authorId { get; set; }
        public string content { get; set; }
        public string author { get; set; }
        public DateTime createDate { get; set; }
        public bool published { get; set; }
    }
}
