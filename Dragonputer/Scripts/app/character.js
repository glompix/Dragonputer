var Character;

(function () {
    'use strict';

    /* Ability Score value type */
    function Ability(value) {
        this.value = value || 0;
    }
    Ability.prototype.mod = function () {
        return Math.floor((this.value - 10) / 2.0);
    };

    /* Defense Score value type */
    function Defense(c, armor, classBonus, feat, enh, misc1, misc2) {
        this.c = c;
        this.armor = armor;
        this.classBonus = classBonus;
        this.feat = feat;
        this.enh = enh;
        this.misc1 = misc1;
        this.misc2 = misc2;
    }
    Defense.prototype.base = function () {
        return 10 + this.c.halfLevel();
    };
    Defense.prototype.score = function () {
        return this.base()
            + (parseInt(this.armor) || 0)
            + (parseInt(this.classBonus) || 0)
            + (parseInt(this.feat) || 0)
            + (parseInt(this.enh) || 0)
            + (parseInt(this.misc1) || 0)
            + (parseInt(this.misc2) || 0);
    };

    function Initiative(c, misc) {
        this.c = c;
        this.misc = misc || 0;
    }
    Initiative.prototype.mod = function () {
        return this.c.dexterity.mod() + this.c.halfLevel() + this.misc;
    }

    function HitPoints() {
        this.current = 0;
        this.temp = 0;
        this.max = 0;
        this.surgesPerDay = 0;
    }
    HitPoints.prototype.bloodied = function () { return Math.floor(this.max / 2.0); }
    HitPoints.prototype.surgeValue = function () { return Math.floor(this.max / 4.0); }

    function Power(type, name) {
        this.type = type;
        this.name = name;
        this.flavor = '';
        this.properties = '';
        this.range = '';
        this.target = '';
        this.attack = {
            source: '',
            target: ''
        };
        this.description = '';
    }

    /* Character model */
    Character = function (source) {

        this.id = 0;
        this.timestamp = new Date(0);

        this.name = 'glompix';
        this.experience = 9000;
        this.race = '';
        this.diety = '';

        this.level = function () { return calculateLevel(this.experience); };
        this.halfLevel = function () { return Math.floor(this.level() / 2.0); };

        this.hitpoints = new HitPoints();
        this.statusEffects = []; // simple list of strings.

        this.strength = new Ability();
        this.constitution = new Ability();
        this.dexterity = new Ability();
        this.intelligence = new Ability();
        this.wisdom = new Ability();
        this.charisma = new Ability();

        this.armorClass = new Defense(this);
        this.fortitude = new Defense(this);
        this.reflex = new Defense(this);
        this.willpower = new Defense(this);

        this.init = new Initiative(this);
        this.lastSaved = new Date();

        this.powers = [];
        this.powers.add = function (type, name) {
            if (type && !name)
                return null;
            var p = new Power(type, name);
            this.push(p);
            return p;
        };

        this.json = function () { return JSON.stringify(this, censor('c')); }

        if (source) {
            copyObject(source, this);
        }

        function copyObject(m, target) {
            for (var prop in m) {
                // One thing that sucks is that this will fail if the type of a property changes!
                if (target.hasOwnProperty(prop)) {
                    var sourceObj = m[prop];
                    var sourceType = typeof sourceObj;
                    if (sourceObj instanceof Array && target[prop].add) {
                        target[prop].length = 0;
                        for (var i = 0; i < sourceObj.length; i++) {
                            if (target[prop].addItem === 'copy') {
                                target[prop].push(sourceObj);
                            }
                            else if (typeof target[prop].add === 'function') {
                                var p = target[prop].add();
                                copyObject(sourceObj[i], p);
                            }
                        }
                    }
                    else if (m[prop].constructor === Date) {
                        target[prop] = new Date(m[prop].getTime());
                    }
                    else if (sourceType === 'object') {
                        copyObject(sourceObj, target[prop]);
                    }
                    else if (sourceType === 'string' || sourceType === 'number') {
                        target[prop] = sourceObj;
                    }
                }
            }
            if (typeof target.timestamp === 'string') {
                target.timestamp = new Date(target.timestamp);
            }
        }
    };

    /* helper functions */
    /* Calculate player level from XP based on 4e rules */
    function calculateLevel(experience) {
        if (experience < 0) { return 0; }
        else if (experience < 1000) { return 1; }
        else if (experience < 2250) { return 2; }
        else if (experience < 3750) { return 3; }
        else if (experience < 5500) { return 4; }
        else if (experience < 7500) { return 5; }
        else if (experience < 10000) { return 6; }
        else if (experience < 13000) { return 7; }
        else if (experience < 16500) { return 8; }
        else if (experience < 20500) { return 9; }
        else if (experience < 26000) { return 10; }
        else if (experience < 32000) { return 11; }
        else if (experience < 39000) { return 12; }
        else if (experience < 47000) { return 13; }
        else if (experience < 57000) { return 14; }
        else if (experience < 69000) { return 15; }
        else if (experience < 83000) { return 16; }
        else if (experience < 99000) { return 17; }
        else if (experience < 119000) { return 18; }
        else if (experience < 143000) { return 19; }
        else if (experience < 175000) { return 20; }
        else if (experience < 210000) { return 21; }
        else if (experience < 255000) { return 22; }
        else if (experience < 310000) { return 23; }
        else if (experience < 375000) { return 24; }
        else if (experience < 450000) { return 25; }
        else if (experience < 550000) { return 26; }
        else if (experience < 675000) { return 27; }
        else if (experience < 825000) { return 28; }
        else if (experience < 1000000) { return 29; }
        else { return 30; }
    }

    // Function generator for excluding members from JSON.stringify()./
    function censor(value) {
        return function (k, v) {
            if (k === value) {
                return undefined;
            }
            else {
                return v;
            }
        };
    }

})();