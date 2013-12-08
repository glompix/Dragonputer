(function () {
    'use strict';

    angular.module('dragonputer').controller('CharacterSheetController', ['$scope', 'localStorageService', 'facebookAuthService', 'characterService',
        function ($scope, localStorageService, facebookAuthService, characterService) {

            function importCharacter(character) {
                if (character) {
                    console.log('Importing Character');
                    if (!$scope.c.timestamp || character.timestamp >= $scope.c.timestamp) {
                        $scope.c = character;
                        $scope.$apply();
                    }
                    else {
                        console.warn('Character on server older than local character.');
                    }
                }
            }

            var data = localStorageService.get('dragonputer.character');
            if (data) {
                console.log('Loading: ', data);
                $scope.c = new Character(data);
            }
            else {
                console.log('New Character');
                $scope.c = new Character();
            }

            $scope.canSave = function () { return $scope.c.json() !== data };
            $scope.save = function () {
                console.log('Saving: ', $scope.c);
                characterService.save(facebookAuthService.getSignedRequest(), $scope.c);
            };

            $scope.login = facebookAuthService.login;
            $scope.logout = facebookAuthService.logout;
            $scope.loggedIn = facebookAuthService.loggedIn;
            $scope.username = facebookAuthService.getCurrentUserName;

            facebookAuthService.authResponseChange = _.debounce(function () {
                $scope.$apply();
                if (facebookAuthService.loggedIn()) {
                    var signedRequest = facebookAuthService.getSignedRequest();
                    characterService.registerUser(signedRequest).then(function () {
                        characterService.get(signedRequest, importCharacter);
                    });
                }
            }, 1000, true);
        }
    ]);
})();