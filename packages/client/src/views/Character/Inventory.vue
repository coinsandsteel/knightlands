<template>
  <div class="inv-root">
    <AnimatedBackground v-if="!hideBg"></AnimatedBackground>
    <!-- Inventory  -->
    <LootContainer
      :inventory="true"
      :filters="filters"
      :filtersStore="filtersStore"
      :commitCmd="commitCmd"
      @hint="_showHint"
      v-model="items"
      class="height-100"
    ></LootContainer>

    <!-- Loot hints -->
    <ScrollableItemHint
      ref="scrollHint"
      :items="items"
      @action="handleItemAction"
      :getHintButtons="getHintButtons"
    ></ScrollableItemHint>

    <portal to="footer" :slim="true" v-if="isActive">
      <CustomButton type="yellow" @click="goToCraft">{{
        $t("btn-craft")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import CustomButton from "@/components/Button.vue";

import ScrollableItemHint from "@/components/Item/ScrollableItemHint.vue";
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import ItemActionHandler from "@/components/Item/ItemActionHandler.vue";

export default {
  mixins: [ActivityMixin, ItemActionHandler],
  components: {
    AnimatedBackground,
    CustomButton,
    LootContainer,
    ScrollableItemHint
  },
  props: ["hideBg", "filters", "commitCmd", "filtersStore"],
  data: () => ({
    showHintItems: false,
    request: null,
    showDetails: false,
    items: []
  }),
  methods: {
    _showHint(item, index) {
      if (!item) {
        return;
      }

      this.$refs.scrollHint.showHint(index);
    },
    getHintButtons(item) {
      if (!item) {
        return null;
      }

      let buttons = null;

      const slot = this.$game.itemsDB.getSlot(item.template);
      if (slot === null) {
        return null;
      }

      if (this.$character.equipment[slot] && !item.equipped) {
        buttons = [
          {
            title: "btn-compare",
            response: "compare",
            type: "grey"
          }
        ];
      }
      return buttons;
    },
    goToCraft() {
      this.$router.push({ name: "blacksmith" });
    }
  }
};
</script>

<style scoped>
.inv-root {
  overflow: hidden;
}
</style>
