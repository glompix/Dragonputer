var Character;

(function () {
    'use strict';

    
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
        return 
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
        // This is *the* data structure for a character sheet. It is data only to make
        // saving and restoring characters dead simple.
        var data = {
            // Housekeeping
            id: 0,
            timestamp: new Date(0),

            // Meta
            name: '',
            experience: 0,
            race: '',
            class$: '',
            diety: '',

            // Status
            hitpoints: {
                current: 0,
                temp: 0,
                max: 0
            },
            surges: {
                current: 0,
                perDay: 0
            },
            statusEffects: [],

            // Abilities
            strength: { value: 0 },
            constitution: { value: 0 },
            dexterity: { value: 0 },
            intelligence: { value: 0 },
            wisdom: { value: 0 },
            charisma: { value: 0 },
            initiative: { misc: 0 },

            // Defenses
            armorClass: { armor: 0, classBonus: 0, feat: 0, enh: 0, misc1: 0, misc2: 0 },
            fortitude: { armor: 0, classBonus: 0, feat: 0, enh: 0, misc1: 0, misc2: 0 },
            reflex: { armor: 0, classBonus: 0, feat: 0, enh: 0, misc1: 0, misc2: 0 },
            willpower: { armor: 0, classBonus: 0, feat: 0, enh: 0, misc1: 0, misc2: 0 },

            // Powers
            powers: [],
            rituals: [],

            // Skills
            skills: [
                { name: 'Acrobatics', ability: 'DEX', trained: false, armorPenalty: 0, misc: 0 },
                { name: 'Arcana', ability: 'INT', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Athletics', ability: 'STR', trained: false, armorPenalty: 0, misc: 0 },
                { name: 'Bluff', ability: 'CHA', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Diplomacy', ability: 'CHA', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Dungeoneering', ability: 'WIS', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Endurance', ability: 'CON', trained: false, armorPenalty: 0, misc: 0 },
                { name: 'Heal', ability: 'WIS', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'History', ability: 'INT', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Insight', ability: 'WIS', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Intimidate', ability: 'CHA', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Nature', ability: 'WIS', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Perception', ability: 'WIS', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Religion', ability: 'INT', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Stealth', ability: 'DEX', trained: false, armorPenalty: 0, misc: 0 },
                { name: 'Streetwise', ability: 'CHA', trained: false, armorPenalty: 'n/a', misc: 0 }, 
                { name: 'Thievery', ability: 'DEX', trained: false, armorPenalty: 0, misc: 0 }
            ],

            // Items & Currency
            items: []
        };

        function abilityMod(value) {
            return Math.floor((value - 10) / 2.0);
        }

        function abilityModByName(name) {
            if (name === 'STR') { return calc.strength.mod(); }
            else if (name === 'CON') { return calc.constitution.mod(); }
            else if (name === 'DEX') { return calc.dexterity.mod(); }
            else if (name === 'INT') { return calc.intelligence.mod(); }
            else if (name === 'WIS') { return calc.wisdom.mod(); }
            else if (name === 'CHA') { return calc.charisma.mod(); }
            else { console.warn('Invalid ability name.'); return undefined }
        }

        function defenseBase() {
            return 10 + calc.halfLevel();
        }

        function getSkill(name) {
            $.each(skills, function (index, value) {
                if (value.name === name) {
                    return value;
                }
            });
            return undefined;
        }

        function defenseScore(d) {
            return defenseBase()
                + (parseInt(d.armor) || 0)
                + (parseInt(d.classBonus) || 0)
                + (parseInt(d.feat) || 0)
                + (parseInt(d.enh) || 0)
                + (parseInt(d.misc1) || 0)
                + (parseInt(d.misc2) || 0);
        }

        // This object contains the calculations the character sheet uses. Note that this creates
        // a conventions useful in views. Always {{ c.calc.ass() }} and ng-model="c.data.ass".
        var calc = {
            level: function () { return calculateLevel(data.experience); },
            halfLevel: function () { return Math.floor(calc.level() / 2.0); },

            hitpoints: {
                bloodied: function () { return Math.floor(data.hitpoints.max / 2.0); },
            },
            surges: {
                hpValue: function () { return Math.floor(data.hitpoints.max / 4.0); }
            },

            strength: { mod: function () { return abilityMod(data.strength.value); } },
            constitution: { mod: function () { return abilityMod(data.constitution.value); } },
            dexterity: { mod: function () { return abilityMod(data.dexterity.value); } },
            intelligence: { mod: function () { return abilityMod(data.intelligence.value); } },
            wisdom: { mod: function () { return abilityMod(data.wisdom.value); } },
            charisma: { mod: function () { return abilityMod(data.charisma.value); } },
            initiative: { mod: function () { return calc.dexterity.mod() + calc.halfLevel() + data.initiative.misc; } },

            armorClass: {
                base: defenseBase,
                score: function () { return defenseScore(data.armorClass); }
            },
            fortitude: {
                base: defenseBase,
                score: function () { return defenseScore(data.fortitude); }
            },
            reflex: {
                base: defenseBase,
                score: function () { return defenseScore(data.reflex); }
            },
            willpower: {
                base: defenseBase,
                score: function () { return defenseScore(data.willpower); }
            },

            skills: {
                abilMod: function (skill) { return abilityModByName(skill.ability); },
                bonus: function (skill) {
                    return calc.skills.abilMod(skill)
                        + calc.halfLevel()
                        + (skill.trained ? 5 : 0)
                        + (skill.armorPenalty === 'n/a' ? 0 : (parseInt(skill.armorPenalty) || 0))
                        + parseInt(skill.misc) || 0;
                }
            }
        }

        if (source) {
            while (typeof source === 'string') {
                source = JSON.parse(source);
            }
            data = $.extend(data, source);

            // Make corrections:
            if (typeof data.timestamp === 'string') {
                data.timestamp = new Date(data.timestamp);
            }
        }

        this.data = data;
        this.calc = calc;

        this.json = function () { 
            return JSON.stringify(data); 
        }

        this.isBloodied = function () {
            return (parseInt(data.hitpoints.current) || 0) < calc.hitpoints.bloodied();
        }

        this.addPower = function (power) {
            if (power.name) {
                data.powers.push(power);
            }
        }

        this.removePower = function (power) {
            $.each(data.powers, function (index, value) {
                if (power === value) {
                    data.powers.splice(index, 1);
                }
            });
        }

        this.addStatusEffect = function (effect) {
            if (effect.name) {
                data.statusEffects.push(effect);
            }
        }

        this.removeStatusEffect = function (effect) {
            $.each(data.statusEffects, function (index, value) {
                if (effect === value) {
                    data.statusEffects.splice(index, 1);
                }
            });
        }

        this.addItem = function (item) {
            if (item.name) {
                data.items.push(item);
            }
        }

        this.removeItem = function (item) {
            $.each(data.items, function (index, value) {
                if (item === value) {
                    data.items.splice(index, 1);
                }
            });
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