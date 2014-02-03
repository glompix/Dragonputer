using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dragonputer.Controllers
{
    public class AppController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Manifest()
        {            
            var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
            var scripts = System.Web.Optimization.Scripts.Url("~/js/character").ToString();
            var styles = System.Web.Optimization.Styles.Url("~/css/character").ToString();
            var content = @"CACHE MANIFEST
# " + version + @"
/
/Content/site.less
" + scripts + @"
" + styles + @"
" + listFiles("~/Content/fonts") + @"
" + listFiles("~/Scripts/app/templates") + @"

NETWORK:
*
";
             return Content(content, "text/cache-manifest");
         }

        private string listFiles(string virtualPath)
        {
            var fontsPhysicalLoc = this.HttpContext.Server.MapPath(virtualPath);
            var fontsWebLoc = UrlHelper.GenerateContentUrl(virtualPath, this.HttpContext);
            return Directory.EnumerateFiles(fontsPhysicalLoc).Aggregate("", (accum, s) => accum + "\n" + fontsWebLoc + "/" + Path.GetFileName(s)).TrimStart();
            
        }
    }
}
