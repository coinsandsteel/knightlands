"use strict";

class Crafting {
    constructor(recipes, inventory) {
        this._recipes = recipes;
        this._inventory = inventory;
    }

    hasEnoughResourcesForRecipe(recipeId) {
        let recipe = this._recipes[recipeId];
        if (!recipe) {
            return false;
        }

        let enoughResources = true;
        let i = 0;
        const length = recipe.ingridients.length;
        for (; i < length; ++i) {
            let ingridient = recipe.ingridients[i];
            if (!this._inventory.hasItemTemplate(ingridient.itemId, ingridient.quantity)) {
                enoughResources = false;
                break;
            }
        }

        return enoughResources;
    }

    getRecipeIngridients(recipeId) {
        let recipe = this._recipes[recipeId];
        if (!recipe) {
            return [];
        }

        let ingridients = [];
        let i = 0;
        const length = recipe.ingridients.length;
        for (; i < length; ++i) {
            let ingridient = recipe.ingridients[i];
            ingridients.push({
                itemId: ingridient.itemId,
                quantity: ingridient.quantity
            });
        }

        return ingridients;
    }
};

export default Crafting;