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
                'ac', 'armor\\s+class',
                'fort', 'fortitude',
                'ref', 'reflex',
                'will', 'willpower'
            ])
        };

        function matchArrayRegex(array) {
            return new RegExp('\\b(' + array.join('|') + ')\\b', 'gi');
        }

        return function (input) {
            if (!input) return input;

            console.log('abilities', regex.abilityName);
            console.log('defenses', regex.defenseName);
            var html = input.toString();
            html = html.replace(regex.diceRoll, '<code class="dice-roll">$1</code>');
            html = html.replace(regex.abilityName, '<code class="ability-name">$1</code>')
            html = html.replace(regex.defenseName, '<code class="defense-name">$1</code>');
            return $sce.trustAsHtml(html);  
        };
    }]);
})();