<template>
  <div
    class="flex flex-space-evenly flex-no-wrap relative padding-top-2 padding-bottom-1 eq-preview"
  >
    <ItemInfo
      class="info"
      :item="item"
      :hideTitle="true"
      :showLocked="true"
      :lootProps="{ equipment: true, equipmentSlot: itemSlot }"
    >
    </ItemInfo>

    <div class="flex flex-column flex-items-end flex-space-between controls">
      <div class="close-btn margin-right-2" @click="$emit('close')"></div>
      <div class="flex flex-center margin-top-2" v-if="item">
        <CustomButton type="grey" @click="unequip">{{
          $t("btn-unequip")
        }}</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import ItemInfo from "@/components/ItemInfo.vue";
import CustomButton from "@/components/Button.vue";
import ItemActionHandler from "@/components/Item/ItemActionHandler.vue";
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  mixins: [ItemActionHandler],
  props: ["itemSlot"],
  components: {
    CustomButton,
    ItemInfo
  },
  computed: {
    item() {
      if (!this.$character.equipment[this.itemSlot]) {
        return null;
      }

      return this.$game.inventory.getItem(
        this.$character.equipment[this.itemSlot].id
      );
    }
  },
  methods: {
    async unequip() {
      await this.handleItemAction(this.item, ItemActions.Unequip);
    }
  }
};
</script>

<style lang="less" scoped>
.eq-preview {
  min-height: 100%;
  display: grid;

  grid-template-rows: 1fr;
  grid-template-columns: 2rem 1fr 12rem;

  > .info {
    grid-column: 2;
  }

  > .controls {
    grid-column: 3;

    > .close-btn {
      position: unset !important;
    }
  }
}
</style>
