// Service for interacting with facebook login API.
(function () {
    'use strict';

    var _url = "/api/character"
    angular.module('dragonputer').factory('characterService', function ($http, localStorageService) {
        
        return {
            registerUser: function (signedRequest) {
                console.log('Registering User');
                return $http.post("/api/user", {
                    signedRequest: signedRequest
                });
            },
            get: function (signedRequest, callback) {
                // TODO: push get from local storage in here too. Return a promise that's already been filled in a little
                // and return the local version if no newer server version.
                return $http.get(_url, {
                    params: {
                        signedRequest: signedRequest
                    }
                }).success(function (data) {
                    if (data === 'null')
                        return null;
                    else
                        return data;
                });
            },
            save: function (signedRequest, character) {
                character.timestamp = new Date();
                localStorageService.add('dragonputer.character', character);
                return $http.post(_url, {
                    signedRequest: signedRequest,
                    character: character.json()
                }).success(function (id) {
                    console.log('assigning id', id);
                    if (id && /^\d+$/.test(id))
                        character.id = id;
                });
            }
        }
    });
})();