(function () {
    'use strict';

    angular.module('dragonputer').controller('CharacterSheetController', ['$scope', 'facebookAuthService', 'characterService',
        function ($scope, facebookAuthService, characterService) {
            // Load existing character, or create a new one.
            loadCharacter();

            // Set up new character form.
            $scope.$newCharacterForm = newForm();
            if (!$scope.c.data.name) {
                $scope.$newCharacterForm.show = true;
            }

            $scope.canSave = function () { return $scope.c.name || $scope.c.json() !== characterService.getLocal().json(); };
            $scope.save = function () {
                console.log('Saving: ', $scope.c);
                characterService.saveLocal($scope.c);
                characterService.push(facebookAuthService.getSignedRequest(), function () {
                    console.log('Pushed character. Updating local.');
                    loadCharacter();
                });
            };

            $scope.delete = function () {
                characterService.clear();
                $scope.c = characterService.getLocal();
                $scope.$newCharacterForm.show = true;
            };

            // Utility function for working with lists.
            $scope.removeFrom = function (array, item) {
                array.splice($.inArray(item, array), 1);
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

            function newForm() {
                var form = {
                    show: false,
                    name: '',
                    valid: function () {
                        return $scope.$newCharacterForm.name !== '';
                    },
                    submit: function () {
                        if (form.valid()) {
                            $scope.c.data.name = form.name;
                            form.show = false;
                        }
                    }
                };
                return form;
            }

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
        }
    ]);
})();