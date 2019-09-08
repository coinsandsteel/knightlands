"use strict";

class Crafting {
    constructor(recipes, inventory) {
        this._recipes = recipes;
        this._inventory = inventory;
    }

    hasEnoughResourcesForRecipe(recipe) {
        if (typeof recipe != "object") {
            recipe = this.getRecipe(recipe);
            if (!recipe) {
                return false;
            }
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
        let recipe = this.getRecipe(recipeId);
        if (!recipe) {
            return [];
        }

        let ingridients = [];
        let i = 0;
        const length = recipe.ingridients.length;
        for (; i < length; ++i) {
            let ingridient = recipe.ingridients[i];
            ingridients.push({...ingridient});
        }

        return ingridients;
    }

    getRecipe(recipeId) {
        return this._recipes[recipeId];
    }

    getResultItem(recipeId) {
        let recipe = this.getRecipe(recipeId);
        if (!recipe) {
            return null;
        }
        return recipe.resultItem;
    }
};

export default Crafting;