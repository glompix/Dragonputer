using BundleTransformer.Core.Bundles;
using BundleTransformer.Core.Orderers;
using System.Web;
using System.Web.Optimization;

namespace Dragonputer
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new CustomStyleBundle("~/css/common") { Orderer = new NullOrderer()
            }.Include("~/Content/bootstrap/site.less"));
        }
    }
}
