// Service for interacting with facebook login API.
(function () {
    'use strict';

    var _url = "/api/character"
    angular.module('dragonputer').factory('characterService', function ($http, localStorageService) {
        
        return {
            get: function (signedRequest) {
                return $http.get(_url, {
                    params: {
                        signedRequest: signedRequest
                    },
                    responseType: 'json'
                });
            },
            save: function (signedRequest, character) {
                character.timestamp = new Date();
                localStorageService.add('dragonputer.character', data);
                $http.post(_url, {
                    params: {
                        signedRequest: signedRequest,
                        id: character.id,
                        timestamp: character.timestamp,
                        character: character
                    }
                }).success(function (id) {
                    if (id && numer)
                        character.id = id;
                });
            }
        }
    });
})();