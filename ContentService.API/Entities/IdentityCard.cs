using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Entities
{
    public class IdentityCard
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string imgId { get; set; }
        public string imgName { get; set; }

        public int userId { get; set; }
        public User User { get; set; }

    }
}
