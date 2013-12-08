using Dragonputer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Dragonputer.Controllers
{
    public class UserController : ApiController
    {
        // POST api/user
        public void Post(PostUserParams p)
        {
            var user = new FacebookRequestParser().GetToken(p.signedRequest);
            var userId = long.Parse(user.user_id);
            using (var context = new Context())
            {
                if (!context.UserProfiles.Any(u => u.FacebookUserId == userId))
                {
                    context.UserProfiles.Add(new UserProfile { FacebookUserId = userId });
                    context.SaveChanges();
                }
            }
        }

        public class PostUserParams
        {
            public string signedRequest { get; set; }
        }
    }
}
