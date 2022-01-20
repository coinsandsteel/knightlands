<template>
  <div class="inv-root dummy-height">
    <AnimatedBackground v-if="!hideBg"></AnimatedBackground>
    <!-- Inventory  -->
    <LootContainer
      class="height-100"
      :inventory="true"
      :noScroll="noScroll"
      :filters="filters"
      :filtersStore="filtersStore"
      :commitCmd="commitCmd"
      :items="computedItems"
      :hideFilters="hideFilters"
      v-model="resultItems"
      @hint="_showHint"
    ></LootContainer>

    <!-- Loot hints -->
    <ScrollableItemHint
      ref="scrollHint"
      :items="resultItems"
      @action="handleItemAction"
      :getHintButtons="getHintButtons"
    ></ScrollableItemHint>

    <portal to="footer" :slim="true" v-if="!hideFooter && isActive">
      <!-- <CustomButton type="yellow" @click="goToCraft">{{
        $t("btn-craft")
      }}</CustomButton> -->
      <Toggle
        :cb="() => (noEquipped = !noEquipped)"
        :startValue="noEquipped"
        caption="t-equipped"
        class="margin-top-1 margin-bottom-1 compare-font"
      ></Toggle>
    </portal>
  </div>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";

import ScrollableItemHint from "@/components/Item/ScrollableItemHint.vue";
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import ItemActionHandler from "@/components/Item/ItemActionHandler.vue";

import Toggle from "@/components/Toggle.vue";

export default {
  mixins: [ActivityMixin, ItemActionHandler],
  components: {
    AnimatedBackground,
    LootContainer,
    ScrollableItemHint,
    Toggle
  },
  props: [
    "hideBg",
    "filters",
    "commitCmd",
    "filtersStore",
    "items",
    "hideFilters",
    "hideFooter",
    "noScroll"
  ],
  data: () => ({
    showHintItems: false,
    showDetails: false,
    resultItems: [],
    noEquipped: false
  }),
  computed: {
    computedItems() {
      let items = this.items || this.$game.inventory.items;
      items = items.filter(item => {
        const template = this.$game.itemsDB.getTemplate(item.template);
        return template.type !== "lunarResource";
      });
      if (!this.noEquipped) {
        return items.filter(x => !x.equipped);
      }

      return items;
    }
  },
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
      this.$router.push({ name: "alchemy-lab" });
    }
  }
};
</script>

<style scoped>
.inv-root {
  /* overflow: scroll; */
}
</style>
