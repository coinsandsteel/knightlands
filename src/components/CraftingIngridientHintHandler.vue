<script>
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  methods: {
    async handleIngridientHint(item) {
      let buttons = [];
      let recipe = this.$game.crafting.getRecipeByItem(item.template);
      if (recipe) {
        buttons.push({
          type: "yellow",
          title: "btn-open-craft",
          response: true
        });
      }

      let response = await this.showHint(item, buttons);
      if (response === true) {
        // go to ingridient item
        this.$router.push({
          name: "craft",
          params: {
            recipeId: recipe.id
          }
        });
      }
    }
  }
};
</script>