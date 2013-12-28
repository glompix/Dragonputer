/* <cs-list-editor title="string" defaults='JSON' source="Array" />
 *
 * Directive for adding list-editing controls to a section. Can nest
 * elements and treat a <cs-list-editor> like a <ul> and stick <li>s in it.
 * The delete and add functions operate against the collection provided
 * by source. The defaults are used when adding an item.
 */
(function () {
    angular.module('dragonputer').directive('csListEditor', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/Scripts/app/templates/cs-list-editor.html',
            scope: {
                title: '@',
                defaults: '@',
                source: '='
            },
            link: function (scope, $element, attrs) {
                scope.addForm = {
                    visible: false,
                    name: ''
                };
                scope.addItem = function () {
                    if (scope.addForm.name) {
                        var item = JSON.parse(attrs.defaults || '{}');
                        item.name = scope.addForm.name;
                        scope.source.push(item);
                    }
                    scope.addForm.visible = false;
                    scope.addForm.name = '';
                };
            } // link function
        }; // return directive options
    });
})();