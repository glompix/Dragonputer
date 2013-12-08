// Service for interacting with facebook login API.
(function () {
    'use strict';

    var _url = "/api/character";
    var _localKey = 'dragonputer.character';
    angular.module('dragonputer').factory('characterService', function ($http, localStorageService) {
        
        // Save a character to local storage.
        function saveLocal(json) {
            localStorageService.clearAll();
            console.log('Save local', localStorageService.add(_localKey, json), json);
        }

        return {
            registerUser: function (signedRequest) {
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
                character.timestamp = new Date();
                saveLocal(character.json());
            },
            pull: function (signedRequest, callback) {
                // TODO: push get from local storage in here too. Return a promise that's already been filled in a little
                // and return the local version if no newer server version.
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
                var local = localStorageService.get(_localKey);
                return $http.post(_url, {
                    signedRequest: signedRequest,
                    character: JSON.stringify(local)
                }).success(function (id) {
                    id = id.replace(/"/g, '');
                    console.log('Assigning id', id);
                    if (id && /^\d+$/.test(id)) {
                        local.id = parseInt(id);
                        local.timestamp = new Date();
                        saveLocal(JSON.stringify(local));
                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        }
    });
})();