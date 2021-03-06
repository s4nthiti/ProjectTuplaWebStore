﻿using ContentService.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContentService.API.Context
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserImage> UserImages { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<IdentityCard> IdentityCards { get; set; }
    }
}
