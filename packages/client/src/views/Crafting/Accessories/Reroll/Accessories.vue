<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <keep-alive>
      <EquippedItemList
        v-if="onlyEquipped"
        :filter="equippedAccessoriesFilter"
        :hintHandler="_handleHint"
      />
      <ItemList
        v-else-if="items.length > 0"
        :items="items"
        @hint="_handleHint"
      />
    </keep-alive>

    <ScrollableItemHint
      ref="scrollHint"
      :items="items"
      :noComparison="true"
      :getHintButtons="getHintButtons"
      :showLocked="false"
      :showButtons="false"
      @action="handleItemAction"
    ></ScrollableItemHint>

    <NoAccessoriesMessage v-if="items.length == 0" />

    <portal to="footer" v-if="isActive">
      <Toggle
        caption="only-equipped"
        :startValue="false"
        :cb="handleEquippedToggle"
      />
      <CustomButton type="grey" @click="goToConvert">{{
        $t("btn-convert-shards")
      }}</CustomButton>
      <HintButton title="i-reroll" :texts="['i-reroll-1']"></HintButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Toggle from "@/components/Toggle.vue";
import HintHandler from "@/components/HintHandler.vue";
import ItemList from "@/components/Item/ItemList.vue";
import ScrollableItemHint from "@/components/Item/ScrollableItemHint.vue";
import EquippedItemList from "../../EquippedItemList.vue";
import Rarity from "@/../../knightlands-shared/rarity";
import HintButton from "@/components/HintButton.vue";
import CustomButton from "@/components/Button.vue";

const {
  EquipmentSlots,
  getSlot
} = require("@/../../knightlands-shared/equipment_slot");

import NoAccessoriesMessage from "../NoAccessoriesMessage.vue";

export default {
  mixins: [AppSection, HintHandler],
  components: {
    HintButton,
    ItemList,
    EquippedItemList,
    Toggle,
    ScrollableItemHint,
    NoAccessoriesMessage,
    CustomButton
  },
  created() {
    this.title = "btn-reroll-acc";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    onlyEquipped: false,
    rarities: Rarity
  }),
  computed: {
    items() {
      return this.$game.inventory.filterItemsByType({
        filters: {},
        filter: (item, template) => {
          return (
            this.equippedAccessoriesFilter(item, template) &&
            !item.equipped
          );
        }
      });
    }
  },
  methods: {
    goToConvert() {
      this.$router.push({
        name: "convert"
      });
    },
    handleItemAction(item, action) {
      if (action) {
        this.$router.push({
          name: "reroll-acc",
          params: {
            itemId: item.id
          }
        });
      }
    },
    getHintButtons() {
      return [
        {
          title: "btn-select",
          response: true,
          type: "yellow"
        }
      ];
    },
    async _handleHint(item, index) {
      if (!item) {
        return;
      }

      if (item.locked) {
        return;
      }

      if (this.onlyEquipped) {
        this.handleItemAction(
          item,
          await this.showHint(item, this.getHintButtons(item), {
            showButtons: false
          })
        );
      } else {
        this.$refs.scrollHint.showHint(index);
      }
    },
    handleEquippedToggle(value) {
      this.onlyEquipped = value;
    },
    equippedAccessoriesFilter(item, template) {
      const slot = getSlot(template.equipmentType);
      return slot == EquipmentSlots.Ring || slot == EquipmentSlots.Necklace;
    }
  }
};
</script>
