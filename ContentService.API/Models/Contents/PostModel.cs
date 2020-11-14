using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Models.Contents
{
    public class PostModel
    {
        [Required]
        public string content { get; set; }
    }
}
