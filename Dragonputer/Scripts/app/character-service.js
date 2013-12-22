// Service for interacting with facebook login API.
(function () {
    'use strict';

    var _url = "/api/character";
    var _localKey = 'dragonputer.character';
    angular.module('dragonputer').factory('characterService', function ($http, localStorageService) {
        
        // This service handles getting/setting characters in the local store, and also pushing or pulling
        // characters from a remote service. A pull will store the pulled character directly to local storage,
        // if the character on the server is newer than the one on local.

        // Save a character to local storage.
        function saveLocal(json) {
            localStorageService.clearAll();
            localStorageService.add(_localKey, json);
        }

        return {
            registerUser: function (signedRequest) {
                if (!signedRequest)
                    return;

                console.log('Registering User...');
                return $http.post("/api/user", {
                    signedRequest: signedRequest
                });
            },
            getLocal: function() {
                var json = localStorageService.get(_localKey);
                return new Character(json);
            },
            saveLocal: function(character) {
                character.data.timestamp = new Date();
                saveLocal(character.json());
            },
            clear: function () {
                localStorageService.clearAll();
            },
            pull: function (signedRequest, callback) {
                if (!signedRequest)
                    return;

                return $http.get(_url, {
                    params: {
                        signedRequest: signedRequest
                    }
                }).success(function (data) {
                    if (callback && data !== 'null') {
                        saveLocal(data);
                        callback();
                    }
                });
            },
            push: function (signedRequest, callback) {
                if (!signedRequest)
                    return;

                var json = localStorageService.get(_localKey);
                var character = new Character(json);
                return $http.post(_url, {
                    signedRequest: signedRequest,
                    character: character.json()
                }).success(function (id) {
                    id = id.replace(/"/g, '');
                    console.log('Assigning id', id);
                    if (id && /^\d+$/.test(id)) {
                        character.data.id = parseInt(id);
                        character.data.timestamp = new Date();
                        saveLocal(character.json());
                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        }
    });
})();