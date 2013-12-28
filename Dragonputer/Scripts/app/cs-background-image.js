// cs-background-image.js
// Allows setting of an element's background image via model. Ripped
// from StackOverflow: http://stackoverflow.com/questions/13781685/angularjs-ng-src-equivalent-for-background-imageurl

(function () {
    'use strict';

    angular.module('dragonputer').directive('csBackgroundImage', function () {
        return {
            restrict: 'A',
            scope: {
                image: '=csBackgroundImage'
            },
            link: function (scope, $element, attrs) {
                scope.$watch('image', function () {
                    var data = scope.image
                        ? 'url(' + scope.image + ')'
                        : 'none';
                    $element.css({
                        'background-image': data
                    });
                });
            }
        };
    });
})();