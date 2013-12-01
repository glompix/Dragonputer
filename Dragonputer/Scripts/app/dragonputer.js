(function () {
    'use strict';

    var dragonputer = angular.module('dragonputer', []);

    dragonputer.controller('CharacterSheetController', ['$scope', function ($scope) {

        $scope.c = new Character();
    }]);
})();
