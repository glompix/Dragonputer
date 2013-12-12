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
            var content = @"CACHE MANIFEST
# " + version + @"
/
/Content/site.less
" + System.Web.Optimization.Scripts.Url("~/js/character").ToString();
            return Content(content, "text/cache-manifest");
        }
    }
}
