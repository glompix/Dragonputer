//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Dragonputer.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserProfile
    {
        public UserProfile()
        {
            this.CharacterSheets = new HashSet<CharacterSheet>();
        }
    
        public long Id { get; set; }
        public long FacebookUserId { get; set; }
    
        public virtual ICollection<CharacterSheet> CharacterSheets { get; set; }
    }
}
