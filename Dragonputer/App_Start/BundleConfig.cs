using System.Web;
using System.Web.Optimization;
namespace Dragonputer
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            var charJsBundle = new ScriptBundle("~/js/character").Include(
                "~/Scripts/underscore.js",
                "~/Scripts/jquery-2.0.3.js",
                "~/Scripts/angular.js",
                "~/Scripts/angular-local-storage.js",
                "~/Scripts/modernizr-2.6.2.js",
                "~/Scripts/bootstrap.min.js",
                "~/Scripts/jquery.easing.1.3.js",
                "~/Scripts/app/dragonputer.js",
                "~/Scripts/app/character.js",
                "~/Scripts/app/character-service.js",
                "~/Scripts/app/facebook-auth-service.js",
                "~/Scripts/app/filereader-service.js",
                "~/Scripts/app/cs-background-image.js",
                "~/Scripts/app/cs-file-input.js",
                "~/Scripts/app/cs-list-editor.js",                
                "~/Scripts/app/character-sheet-controller.js"
            );
            bundles.Add(charJsBundle);
        }
    }
}
