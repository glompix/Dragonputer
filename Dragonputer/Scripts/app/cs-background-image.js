// cs-background-image.js
// Allows setting of an element's background image via model. Ripped
// from StackOverflow: http://stackoverflow.com/questions/13781685/angularjs-ng-src-equivalent-for-background-imageurl

(function () {
    'use strict';

    angular.module('dragonputer').directive('csBackgroundImage', function () {
        return {
            restrict: 'A',
            scope: {
                image: '=csBackgroundImage',
            },
            link: function (scope, $element, attrs) {
                function refresh() {
                    var imageData = scope.image
                        ? 'url(' + scope.image + ')'
                        : 'none';
                    $element.css({
                        'background-image': imageData
                    });
                }
                scope.$watch('image', refresh);
            }
        };
    });
    angular.module('dragonputer').directive('csBackgroundOpacity', function () {
        return {
            restrict: 'A',
            scope: {
                opacity: '=csBackgroundOpacity'
            },
            link: function (scope, $element, attrs) {
                function refresh() {
                    var color = $element.css('background-color');
                    var value = scope.opacity / 100.0;
                    if (color.match(/^rgba\(/)) {
                        color = color.replace(/[^,]+\)$/, value.toString() + ')');
                    }
                    else if (color.match(/^rgb\(/)) {
                        color = color.replace(/^rgb\(/, 'rgba(');
                        color = color.replace(/\)$/, ',' + value.toString() + ')');
                    }
                    console.log('color', color);
                    $element.css({
                        'background-color': color
                    });
                }
                scope.$watch('opacity', refresh);
            }
        };
    });
})();