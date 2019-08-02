/**
 * @name Reroll-Initiative
 * @version 0.1
 * @author Evan Clarke <errational>
 * @description Rerolls initiative on combat round change
 */

 /**
  * --------------------
  * Set module constants
  * --------------------
  */
const RRI_CONFIG = {
    reroll: true,
    actorTypes: all
}
  

/**
 * @class RerollInitiative
 * @description Hooks on combat update and rerolls initiative for all combatants
 * @todo Add configurability for when to reroll and for whom
 */
class RerollInitiative {
    constructor() {
        this.postUpdateCombatHook();
        this.settings = {};
        this._registerSettings();
    }

    /**
     * module settings
     */
    _registerSettings () {
        game.settings.register('reroll-initiative', "rriStatus", {
            name: "Reroll-Initiative Status",
            hint: "Enable the rerolling initiative true/false",
            default: RRI_CONFIG.reroll,
            //default: "",
            type: Boolean,
            scope: "world",
            onChange: setting => {
              console.log("setting change",setting);
            }
        });

        game.settings.register('reroll-initiative', "actorTypesToReroll", {
            name: "Actor Types to Reroll",
            hint: "Specify the actor types to reroll PCs/NPCs/All",
            default: RRI_CONFIG.actorTypes,
            //default: "",
            type: String,
            scope: "world",
            onChange: setting => {
              console.log("setting change",setting);
            }
        });
    }

    _defaultSettings() {
        let defaults = RRI_CONFIG;

        return defaults;
    }

    _saveSettings () {
        game.settings.set("reroll-initiative","defaultSettings",JSON.stringify(this.settings));
    }

    _loadSettings (){
        this.settings = game.settings.get("reroll-initiative","defaultSetting");
    }

    /**
     * @name postUpdateCombatHook
     * @description Hook on combat update and if round in update is greater than previous -- call resetAndReroll
     */
    postUpdateCombatHook() {
        Hooks.on("updateCombat", (combat,update) =>  {
            this._loadSettings();

            if(this.settings.enabled){
                
                if(update.round && combat._previous && update.round > combat.previous.round){
                    //console.log("Reroll-Initiative: Round incremented - rerolling initiative")
                    this.resetAndReroll(combat);
                }
            }
            
        }); 
    }

    /**
     * @name resetAndReroll
     * @param {Combat} combat
     * @description For the given combat instance, call the resetAll method and the rollAll method
     */
    async resetAndReroll(combat){
        await combat.resetAll();
        combat.rollAll();
    }
}

class RerollInitiativeConfig extends CombatTrackerConfig{
    constructor(){
        defaultOptions = super.defaultOptions;
        template = defaultOptions.template;
    }
    //in the template, find the last element and then add a checkbox that flags whether to reroll or not
    
    _updateObject(){
      //update the rri setting based on the forms data  
    }
    
    

    
}

let rri = new RerollInitiative();




