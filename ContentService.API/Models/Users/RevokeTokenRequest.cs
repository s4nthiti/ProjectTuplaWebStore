﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Models.Users
{
    public class RevokeTokenRequest
    {
        public string Token { get; set; }
    }
}
