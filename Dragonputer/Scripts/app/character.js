var Character;

(function () {
    'use strict';

    /* Ability Score value type */
    function Ability(value) {
        this.value = value || 0;
    }
    Ability.prototype.mod = function () {
        return Math.floor((this.value - 10) / 2.0);
    }

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
    }
    Defense.prototype.score = function () {
        console.log(this);

        return this.base()
            + this.armor
            + this.classBonus
            + this.feat
            + this.enh
            + this.misc1
            + this.misc2;
    };

    /* helper functions */
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

    function Initiative(c, misc) {
        this.c = c;
        this.misc = misc || 0;
    }
    Initiative.prototype.mod = function () {
        return this.c.dexterity.mod() + this.c.halfLevel() + this.misc;
    }

    /* Character model */
    Character = function () {
        this.experience = 9000;
        this.level = function () { return calculateLevel(this.experience); };
        this.halfLevel = function () { return Math.floor(this.level() / 2.0); };
        
        this.strength = new Ability(10);
        this.constitution = new Ability(12);
        this.dexterity = new Ability(12);
        this.intelligence = new Ability(16);
        this.wisdom = new Ability(16);
        this.charisma = new Ability(13);

        this.armorClass = new Defense(this, 0, 0, 0, 0, 0, 0);
        this.fortitude = new Defense(this, 0, 0, 0, 0, 0, 0);
        this.reflex = new Defense(this, 0, 0, 0, 0, 0, 0);
        this.willpower = new Defense(this, 0, 0, 0, 0, 0, 0);

        this.init = new Initiative(this, 0);
    }
})();