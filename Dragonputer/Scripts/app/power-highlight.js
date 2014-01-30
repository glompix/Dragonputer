(function () {
    'use strict';

    angular.module('dragonputer').filter('powerHighlight', ['$sce', function ($sce) {
        var regex = {
            diceRoll: /\b(\d+d\d+)\b/gi,
            abilityName: matchArrayRegex([
                'str', 'strength',
                'con', 'constitution',
                'dex', 'dexterity',
                'int', 'intelligence',
                'wis', 'wisdom',
                'cha', 'charisma'
            ]),
            defenseName: matchArrayRegex([
                'ac', 'armor\s+class',
                'fort', 'fortitude',
                'ref', 'reflex',
                'will', 'willpower'
            ])
        };

        function matchArrayRegex(array) {
            return new RegExp('\b(' + array.join('|') + ')\b', 'gi');
        }

        return function (input) {
            var html = input
                ? input.toString()
                    .replace(regex.diceRoll, '<code class="dice-roll">$1</code>')
                    .replace(regex.abilityName, '<code class="ability-name">$1</code>')
                    .replace(regex.defenseName, '<code class="defense-name">$1</code>')
                : input;
            return $sce.trustAsHtml(html);  
        };
    }]);
})();