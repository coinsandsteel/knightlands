<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>
    <Title class="margin-bottom-2">Select item:</Title>
    <ItemList
      @hint="handleHint"
      :selecteItem="false"
      :items="items"
      :lootProps="{ showLevel: true, gacha: true, hideQuantity: true }"
    />
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import ItemList from "@/components/Item/ItemList.vue";
import HintHandler from "@/components/HintHandler.vue";
import Elements from "@/../../knightlands-shared/elements";

import { create as CreateDialog } from "vue-modal-dialogs";
import EquipmentIngridientHint from "./EquipmentIngridientHint.vue";
const Hint = CreateDialog(
  EquipmentIngridientHint,
  "type",
  "item",
  "buttons",
  "actions"
);

const Responses = {
  Select: "select",
  LevelUp: "level-up"
};

export default {
  mixins: [AppSection, HintHandler],
  props: {
    itemTemplate: [Number, String],
    includeElemental: {
      type: Boolean,
      default: true
    },
    rarity: String
  },
  components: { ItemList, Title },
  created() {
    this.$options.useRouterBack = true;
  },
  data: () => ({
    selectedItem: null
  }),
  computed: {
    items() {
      if (!this.itemTemplate) {
        return [];
      }

      const filteredItems = this.$game.inventory.getItemsByTemplate(
        this.itemTemplate
      );

      const targetRarity = this.rarity;
      const length = filteredItems.length;
      let filteredIndex = 0;
      for (let i = 0; i < length; ++i) {
        const item = filteredItems[i];
        const isElemental =
          this.$game.itemsDB.getElement(item) == Elements.Physical;
        const rarityMatch =
          !targetRarity || this.$game.itemsDB.getRarity(item) == targetRarity;

        if (
          !item.equipped &&
          this.includeElemental == isElemental &&
          rarityMatch
        ) {
          filteredItems[filteredIndex++] = item;
        }
      }

      filteredItems.length = filteredIndex;

      return filteredItems;
    }
  },
  methods: {
    async handleHint(item) {
      let buttons = [
        {
          type: "yellow",
          response: Responses.Select,
          title: "btn-select"
        }
      ];

      let hintType;
      if (this.$game.itemsDB.getMaxLevel(item) != item.level) {
        hintType = "not-max-lvl";
        buttons = [
          {
            type: "yellow",
            response: Responses.LevelUp,
            title: "btn-level-up"
          }
        ];
      }

      const response = await Hint(hintType, item, buttons, {
        actions: { equip: false }
      });

      if (response == Responses.Select) {
        this.return(item);
      } else if (response == Responses.LevelUp) {
        this.levelUp(item);
      }
    },
    return(item) {
      this.$router.replace({
        path: this.$route.query.returnTo,
        query: { item: item.id }
      });
    },
    levelUp(item) {
      if (item.breakLimit != 2) {
        this.$router.push({
          name: "unbind-item",
          params: { itemId: item.id },
          query: { returnTo: this.$route.fullPath }
        });
      } else {
        this.$router.push({
          name: "upgrade-item",
          params: { itemId: item.id },
          query: { returnTo: this.$route.fullPath }
        });
      }
    }
  }
};
</script>
