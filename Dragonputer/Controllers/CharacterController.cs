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
        public CharacterSheet Get(string signedRequest)
        {
            // Only one character per user for now.
            var user = new FacebookRequestParser().GetToken(signedRequest);
            var userId = long.Parse(user.user_id);
            using (var context = new Context())
            {
                var sheet = context.CharacterSheets.AsNoTracking().FirstOrDefault(c => c.UserProfileId == userId);
                return sheet;
            }
        }

        //
        // GET: /Character/
        /// <summary>
        /// Saves a character and returns the id of the character.
        /// </summary>
        public string Post(string signedRequest, int id, DateTime timestamp, string characterJson)
        {
            var user = new FacebookRequestParser().GetToken(signedRequest);
            var userId = long.Parse(user.user_id);
            using (var context = new Context())
            {
                var sheet = context.CharacterSheets.FirstOrDefault(c => c.UserProfileId == userId && c.Id == id)
                    ?? new CharacterSheet();                

                sheet.UserProfileId = userId;
                sheet.Sheet = characterJson;
                sheet.Timestamp = DateTime.Now;

                if (sheet.Id == default(long))
                    context.CharacterSheets.Add(sheet);

                context.SaveChanges();

                return sheet.Id.ToString();
            }
        }
    }
}
