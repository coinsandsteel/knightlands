<template>
  <div
    class="flex full-flex padding-bottom-1 width-100 flex-column flex-no-wrap flex-items-center"
  >
    <div class="margin-bottom-2 width-75">
      <progress-bar
        :maxValue="maxStat"
        :hideMaxValue="true"
        v-model="barValue"
        :barType="color"
      ></progress-bar>
    </div>

    <div
      class="width-100"
      v-bar="{
        preventParentScroll: true,
        scrollThrottle: 30
      }"
    >
      <div>
        <div class="flex flex-space-evenly width-100">
          <ItemSelector
            class="flex-basis-50"
            v-for="item in items"
            :key="item.id"
            :item="item"
            :predictedHp="barValue"
            :maxStat="maxStat"
            @changed="handleItemSelected"
            @hint="handleHint"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CharacterStats from "@/../../knightlands-shared/character_stat.js";
const ItemType = require("@/../../knightlands-shared/item_type");
const ItemActions = require("@/../../knightlands-shared/item_actions");
import ItemSelector from "./ItemSelector.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  props: ["stat"],
  mixins: [HintHandler],
  components: { ItemSelector, ProgressBar },
  data: () => ({
    restoredValue: 0,
    usedItems: {}
  }),
  mounted() {
    this.selectedItems = {};
  },
  computed: {
    maxStat() {
      return this.$game.character.maxStats[this.stat];
    },
    timer() {
      return this.$game.character.getTimer(this.stat);
    },
    barValue() {
      return Math.min(this.restoredValue + this.timer.value, this.maxStat);
    },
    color() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "red";
        case CharacterStats.Energy:
          return "blue";
        case CharacterStats.Stamina:
          return "yellow";
      }
      return "";
    },
    items() {
      let itemsDB = this.$game.itemsDB;
      return this.$game.inventory.filterItems(x => {
        if (x.unique) {
          return false;
        }

        const template = itemsDB.getTemplate(x.template);
        if (template.type != ItemType.Consumable || !template.action) {
          return false;
        }

        if (template.action.action == ItemActions.RefillTimer) {
          if (template.action.stat == this.stat) {
            return true;
          }
        }

        return false;
      });
    }
  },
  methods: {
    handleItemSelected(count, item) {
      const action = this.$game.itemsDB.getTemplate(item).action;
      this.selectedItems[item.id] = {
        template: item.template,
        value: action.value,
        relative: action.relative,
        count: count,
        stat: action.stat
      };

      this.$set(this.usedItems, item.template, {
        count,
        id: item.id
      });

      let restoredValue = 0;
      for (let itemId in this.selectedItems) {
        // first relative bonuses
        const consumable = this.selectedItems[itemId];
        if (consumable.relative) {
          restoredValue +=
            (this.$game.character.getMaxStat(consumable.stat) *
              consumable.value *
              consumable.count) /
            100;
        }
      }

      for (let itemId in this.selectedItems) {
        // first relative bonuses
        const consumable = this.selectedItems[itemId];
        if (!consumable.relative) {
          restoredValue += consumable.value * consumable.count;
        }
      }

      this.restoredValue = restoredValue;

      this.$emit("canProceed", restoredValue > 0, this.usedItems);
    }
  }
};
</script>
