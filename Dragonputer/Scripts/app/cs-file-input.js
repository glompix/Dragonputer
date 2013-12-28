// Shamelessly pulled from http://odetocode.com/blogs/scott/archive/2013/07/05/a-file-input-directive-for-angularjs.aspx
// Great job!

angular.module('dragonputer').directive('csFileModel', function ($parse, filereaderService) {
    return {
        restrict: 'A',
        link: function (scope, $element, attrs) {
            console.log('cs-file-model on', $element);
            var modelExpression = $parse(attrs.csFileModel);
            var updateModel = function () {
                console.log('fileInput changed:', $element[0]);
                scope.$apply(function () {
                    // Read asynchronously
                    filereaderService
                        .readAsDataUrl($element[0].files[0], scope)
                        .then(function (result) {
                            // Set scope.{modelExpression} = base64File.
                            console.log('file done reading', result);
                            modelExpression.assign(scope, result);

                            // Clear selection
                            $element.wrap('<form>').closest('form').get(0).reset();
                            $element.unwrap();
                        });
                });
            };

            $element.bind('change', updateModel);
        }

    };//return

});//appFilereader