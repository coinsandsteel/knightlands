<template>
  <UserDialog
    :compact="true"
    @close="handleClose"
    :disableScroll="true"
    :hideMask="hideMask"
  >
    <template v-slot:content>
      <div
        class="flex flex-no-wrap width-100 padding-top-4 flex-space-between padding-left-1 padding-right-1"
      >
        <div class="flex-basis-50 margin-right-half">
          <ItemHeader
            :item="leftItem"
            :matchItem="matchedItem"
            :showLocked="true"
          />
          <ItemStats :item="leftItem" :matchItem="matchedItem" />
        </div>
        <div class="flex-basis-50 margin-left-half">
          <ItemHeader
            :item="rightItem"
            :matchItem="matchedItem"
            :showLocked="true"
          />
          <ItemStats :item="rightItem" :matchItem="matchedItem" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex width-100">
        <ItemProperties class="flex-basis-50" :item="leftItem"></ItemProperties>
        <ItemProperties
          class="flex-basis-50"
          :item="rightItem"
        ></ItemProperties>
      </div>

      <div class="flex flex-column">
        <Toggle
          :cb="switchPreviewMode"
          :startValue="sameLevel"
          caption="toggle-same-level"
          class="margin-bottom-2"
        ></Toggle>
        <custom-button
          type="yellow"
          v-if="canEquip"
          class="common-btn center"
          @click="handleClose('equip')"
          >{{ $t("btn-equip") }}</custom-button
        >
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import ItemProperties from "@/components/Item/ItemProperties.vue";
import ItemHeader from "@/components/Item/ItemHeader.vue";
import ItemStats from "@/components/Item/ItemStats.vue";
import CustomButton from "@/components/Button.vue";
import Toggle from "@/components/Toggle.vue";

export default {
  props: ["leftItem", "rightItem", "hideMask", "equippedItems"],
  components: {
    UserDialog,
    ItemProperties,
    CustomButton,
    Toggle,
    ItemStats,
    ItemHeader
  },
  data: () => ({
    sameLevel: true
  }),
  computed: {
    matchedItem() {
      if (this.sameLevel) {
        return this.rightItem.level > this.leftItem.level
          ? this.rightItem
          : this.leftItem;
      }
      return null;
    },
    canEquip() {
      if (this.leftItem && this.rightItem) {
        return this.leftItem.id != this.rightItem.id;
      }

      return false;
    }
  },
  methods: {
    getName(item) {
      return this.$game.itemsDB.getName(item.template);
    },
    switchPreviewMode(value) {
      this.sameLevel = value;
    },
    handleClose(response, ...args) {
      if (this.$close) {
        this.$close(response, ...args);
      } else {
        this.$emit("close", this.leftItem, response, ...args);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.item-title {
  background-color: #333333;
}
</style>
