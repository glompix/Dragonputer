(function () {
    'use strict';

    angular.module('dragonputer').controller('CharacterSheetController', ['$scope', '$window', 'facebookAuthService', 'characterService', '$http',
        function ($scope, $window, facebookAuthService, characterService, $http) {
            $scope.localCharacterJson = undefined; // cache of local json, primarily for canSave.
            $scope.export = function () {
                var payload = {
                    "description": 'Dragonputer-' + $scope.c.data.name,
                    "public": true,
                    "files": {
                        "character.json": {
                            "content": $scope.c.json()
                        }
                    }
                };
                $http.post('https://api.github.com/gists', payload).success(function(data, status) {
                    $window.open(data.html_url);
                })
            }

            // Load existing character, or create a new one.
            loadCharacter();

            // Set up new character form.
            $scope.$newCharacterForm = newForm();
            if (!$scope.c.data.name) {
                $scope.$newCharacterForm.show = true;
            }

            // Save
            $scope.canSave = function () { return $scope.c.data.name && $scope.c.json() !== $scope.localCharacterJson; };
            $scope.save = function () {
                console.log('Saving: ', $scope.c);
                characterService.saveLocal($scope.c);
                characterService.push(facebookAuthService.getSignedRequest(), function () {
                    console.log('Pushed character. Updating local.');
                    loadCharacter();
                }, function () {
                    loadCharacter();
                });
            };

            $scope.canDelete = function () { return true; }
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
                    mode: 'name',
                    valid: function () {
                        return $scope.$newCharacterForm.name !== '' || $scope.$newCharacterForm
                    },
                    submit: function () {
                        if (form.valid()) {
                            console.log('submit json', $scope.$newCharacterForm.json);
                            if ($scope.$newCharacterForm.json) {
                                var character = new Character($scope.$newCharacterForm.json);
                                console.log('load json', character);
                                loadCharacter(character);
                            }
                            else {
                                $scope.c.data.name = form.name;
                            }
                            form.show = false;
                        }
                    }
                };
                return form;
            }

            function loadCharacter(character) {
                if (character) {
                    $scope.c = character;
                    $(document).trigger('characterLoaded');
                }
                else {
                    character = characterService.getLocal();
                    if (character && !$scope.c) {
                        $scope.c = character;
                        $scope.localCharacterJson = character.json();
                        $(document).trigger('characterLoaded');
                    }
                    else if (character) {
                        console.log('Compare characters', $scope.c.data.timestamp.getTime(), character.data.timestamp.getTime());
                        if (character.data.timestamp.getTime() > $scope.c.data.timestamp.getTime()) {
                            $scope.c = character;
                            $scope.localCharacterJson = character.json();
                            $(document).trigger('characterLoaded');
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        }
                    }
                }
            }
        }
    ]);
})();