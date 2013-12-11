using Dragonputer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace Dragonputer.Controllers
{
    public class CharacterController : ApiController
    {
        public string Get(string signedRequest)
        {
            // Only one character per user for now.
            var user = new FacebookRequestParser().GetToken(signedRequest);
            var userId = long.Parse(user.user_id);
            using (var context = new Context())
            {
                var sheet = context.CharacterSheets.AsNoTracking().FirstOrDefault(c => c.UserProfile.FacebookUserId == userId);
                if (sheet == null)
                    return null;
                else
                    return sheet.Sheet;
            }
        }

        //
        // GET: /Character/
        /// <summary>
        /// Saves a character and returns the id of the character.
        /// </summary>
        public string Post(SaveCharacterParams p)
        {
            var fbUser = new FacebookRequestParser().GetToken(p.signedRequest);
            var fbUserId = long.Parse(fbUser.user_id);
            using (var context = new Context())
            {
                var sheet = context.CharacterSheets.FirstOrDefault(c => c.UserProfile.FacebookUserId == fbUserId)
                    ?? new CharacterSheet();

                sheet.UserProfile = context.UserProfiles.Single(u => u.FacebookUserId == fbUserId);
                sheet.Sheet = p.character;
                sheet.Timestamp = DateTime.Now; // TODO: Remove - held on sheet object.

                if (sheet.Id == default(long))
                    context.CharacterSheets.Add(sheet);

                context.SaveChanges();

                return sheet.Id.ToString();
            }
        }

        public class SaveCharacterParams
        {
            public string signedRequest { get; set; }
            public string character { get; set; }
        }
    }
}
