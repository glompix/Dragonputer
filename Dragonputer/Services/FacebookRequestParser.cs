using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Script.Serialization;
using System.Linq;

namespace Dragonputer.Models
{
    public class FacebookRequestParser
    {
        public FacebookAccess GetToken(string signedRequest)
        {
            // https://developers.facebook.com/docs/facebook-login/using-login-with-games/
            var parts = signedRequest.Split(new char[] { '.' }, 2);
            var sig = base64UrlDecode(parts[0]);
            var payload = base64UrlDecode(parts[1]);

            var secretBytes = Encoding.UTF8.GetBytes(getApiSecret());
            var hmacsha256 = new HMACSHA256(secretBytes);
            var expectedSig = hmacsha256.ComputeHash(Encoding.UTF8.GetBytes(parts[1]));

            if (!sig.SequenceEqual(expectedSig))
                throw new FacebookInvalidSignatureException();

            // http://stackoverflow.com/questions/3433252/how-to-decode-oauth-2-0-for-canvas-signed-request-in-c
            var json = Encoding.UTF8.GetString(payload);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var result = serializer.Deserialize<FacebookAccess>(json);
            return result;
        }

        private byte[] base64UrlDecode(string data)
        {
            var data1 = data.Replace("=", string.Empty).Replace('-', '+').Replace('_', '/');
            return Convert.FromBase64String(data1.PadRight(data1.Length + (4 - data1.Length % 4) % 4, '='));
        }

        private string getApiSecret()
        {
            // In development, use a file that is .gitignored to keep it out of source control.
            // In production, set a different setting to indicate the literal key.
            var file = WebConfigurationManager.AppSettings["FacebookSecretFile"];
            if (!string.IsNullOrEmpty(file))
            {
                var path = System.Web.Hosting.HostingEnvironment.MapPath(file);
                return System.IO.File.ReadAllText(path).Trim();
            }

            var secret = WebConfigurationManager.AppSettings["FacebookSecret"];
            if (!string.IsNullOrEmpty(secret))
            {
                return secret.Trim();
            }

            throw new FacebookNoSecretSetException();
        }
    }

    public class FacebookAccess
    {
        public string oauth_token { get; set; }
        public string algorithm { get; set; }
        public string expires { get; set; }
        public string issued_at { get; set; }
        public string user_id { get; set; }
    }

    public class FacebookNoSecretSetException : Exception
    {
    }

    public class FacebookInvalidSignatureException : Exception
    {
    }
}