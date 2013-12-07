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
    }
}
