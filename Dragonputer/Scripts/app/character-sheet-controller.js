(function () {
    'use strict';

    angular.module('dragonputer').controller('CharacterSheetController', ['$scope', 'facebookAuthService', 'characterService',
        function ($scope, facebookAuthService, characterService) {

            function loadCharacter() {
                var character = characterService.getLocal();               
                if (character && !$scope.c) {
                    $scope.c = character;
                    $(document).trigger('characterLoaded');
                    console.log('characterLoaded');
                }
                else if (character) {
                    console.log('Compare characters', $scope.c.data.timestamp.getTime(), character.data.timestamp.getTime());
                    if (character.data.timestamp.getTime() > $scope.c.data.timestamp.getTime()) {
                        $scope.c = character;
                        $(document).trigger('characterLoaded');
                        console.log('characterLoaded');
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                }
            }

            loadCharacter();

            $scope.canSave = function () { return $scope.c.json() !== characterService.getLocal().json(); };
            $scope.save = function () {
                console.log('Saving: ', $scope.c);
                characterService.saveLocal($scope.c);
                characterService.push(facebookAuthService.getSignedRequest(), function () {
                    console.log('Pushed character. Updating local.');
                    loadCharacter();
                });
            };

            $scope.login = facebookAuthService.login;
            $scope.logout = facebookAuthService.logout;
            $scope.loggedIn = facebookAuthService.loggedIn;
            $scope.username = facebookAuthService.getCurrentUserName;

            facebookAuthService.authResponseChange = function () {
                $scope.$apply();
                if (facebookAuthService.loggedIn()) {
                    var signedRequest = facebookAuthService.getSignedRequest();
                    characterService.registerUser(signedRequest).then(function () {
                        console.log('Registered.');
                        characterService.pull(signedRequest, function () {
                            console.log('Downloaded a character to local');
                            loadCharacter();
                        });
                    });
                }
            };
        }
    ]);
})();