using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Dragonputer.Models
{
    public class Context : DbContext
    {
        public DbSet<CharacterSheet> CharacterSheets { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}