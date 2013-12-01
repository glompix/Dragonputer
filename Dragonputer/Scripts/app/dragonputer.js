(function () {
    'use strict';

    var dragonputer = angular.module('dragonputer', ['LocalStorageModule']);

    dragonputer.controller('CharacterSheetController', ['$scope', 'localStorageService', function ($scope, localStorageService) {
        var data = localStorageService.get('dragonputer.character')
        if (data) {
            console.log('Loading: ', data);
            var savedObj = data; // JSON.parse(data);
            $scope.c = new Character(savedObj);
        }
        else {
            $scope.c = new Character();
        }

        $scope.canSave = function () { return $scope.c.json() !== data };
        $scope.save = function () {
            data = $scope.c.json();
            console.log('Saving: ', data);
            data.lastSaved = new Date();
            localStorageService.add('dragonputer.character', data);
        };
    }]);
})();
