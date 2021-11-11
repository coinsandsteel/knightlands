<template>
  <user-dialog
    @close="handleClose"
    :titleClass="`rarity-${template.rarity}`"
    :compact="true"
    :hideMask="hideMask"
    :disableScroll="true"
  >
    <template v-slot:content>
      <ItemInfo
        :showLocked="showLocked"
        :item="item"
        :hideTitle="true"
        :preview="preview"
        class="width-80 center"
      ></ItemInfo>

      <slot></slot>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-space-evenly">
        <template v-if="showButtons">
          <div
            class="width-100 margin-bottom-1"
            v-if="!canWear && levelRequired > 0"
          >
            <span class="font-error font-size-20 font-weight-900">{{
              $t("unit-lvl-req", { level: levelRequired })
            }}</span>
          </div>
          <custom-button
            type="yellow"
            v-else-if="canEquip"
            :id="`btn-equip-${item.template}`"
            class="common-btn center"
            @click="handleClose(ItemActions.Equip)"
            >{{ $t("btn-equip") }}</custom-button
          >

          <custom-button
            v-if="canUnequip"
            type="grey"
            class="common-btn center"
            @click="handleClose(ItemActions.Unequip)"
            >{{ $t("btn-unequip") }}</custom-button
          >

          <template v-if="isBox && canOpen">
            <CustomButton
              type="yellow"
              @click="handleClose(ItemActions.OpenBox)"
              >{{ $t("btn-open-box") }}</CustomButton
            >
            <CustomButton
              type="yellow"
              @click="handleClose(ItemActions.OpenBox, Math.min(count, 9))"
              v-if="count > 1 && count <= 9"
              >{{
                $t("btn-open-boxes", { count: Math.min(count, 9) })
              }}</CustomButton
            >
            <CustomButton
              type="yellow"
              @click="handleClose(ItemActions.OpenBox, 10)"
              v-if="count >= 10"
              >{{ $t("btn-open-boxes", { count: 10 }) }}</CustomButton
            >
          </template>

          <template v-else-if="isBox && !canOpen">
            <span class="font-size-20 font-error font-weight-900">{{
              $t("box-lvl-req", { lvl: actionMinLevel })
            }}</span>
          </template>

          <template v-else-if="maxSummons > 0">
            <CustomButton
              type="yellow"
              @click="handleClose(ItemActions.SummonUnit)"
              >{{ $t("btn-open-shard") }}</CustomButton
            >
            <CustomButton
              type="yellow"
              @click="
                handleClose(ItemActions.SummonUnit, Math.min(maxSummons, 9))
              "
              v-if="maxSummons > 1 && maxSummons <= 9"
              >{{
                $t("btn-open-shards", { count: Math.min(maxSummons, 9) })
              }}</CustomButton
            >
            <CustomButton
              type="yellow"
              @click="handleClose(ItemActions.SummonUnit, 10)"
              v-if="maxSummons >= 10"
              >{{ $t("btn-open-shards", { count: 10 }) }}</CustomButton
            >
          </template>

          <div class="flex flex-center" v-else-if="isConsumable && !isSummon">
            <NumericValue
              class=""
              :value="useCount"
              :decreaseCondition="useCount > 1"
              :increaseCondition="useCount < count"
              @inc="useCount++"
              @dec="useCount--"
              @max="useCount = count"
              @reset="useCount = 1"
            ></NumericValue>
            <CustomButton
              type="yellow"
              @click="handleClose(ItemActions.Use, useCount)"
              minWidth="15rem"
              >{{ $t("btn-use-consumable") }}</CustomButton
            >
          </div>
        </template>

        <custom-button
          type="yellow"
          v-for="(btn, index) in buttons"
          :key="index"
          :class="btn.type"
          @click="handleClose(btn.response)"
          >{{ $t(btn.title) }}</custom-button
        >
      </div>
    </template>
  </user-dialog>
</template>

<script>
import CustomButton from "./Button.vue";
import UserDialog from "./UserDialog.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import ItemGetterMixin from "@/components/Item/ItemGetterMixin.vue";
import Stat from "@/../../knightlands-shared/character_stat";
import NumericValue from "@/components/NumericValue.vue";
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  mixins: [ItemGetterMixin],
  props: {
    showLocked: {
      type: Boolean
    },
    equip: {
      type: Boolean
    },
    unequip: {
      type: Boolean
    },
    actions: {
      type: Object,
      default: () => ({
        equip: true
      })
    },
    hideMask: Boolean,
    buttons: Array,
    showButtons: {
      type: Boolean,
      default: true
    },
    equippedItems: Object,
    index: Number,
    preview: Boolean
  },
  data: () => ({
    ItemActions,
    useCount: 1
  }),
  components: {
    NumericValue,
    CustomButton,
    UserDialog,
    ItemInfo
  },
  computed: {
    canOpen() {
      if (this.template.action) {
        return this.template.action.minLevel <= this.$character.level;
      }

      return true;
    },
    canEquip() {
      let equippable = !this.item.equipped;
      if (this.equippedItems) {
        equippable = !this.equippedItems[this.slot];
      } else {
        equippable = !this.$character.equipment[this.slot];
      }
      return equippable && this.actions.equip && this.isEquipment;
    },
    canUnequip() {
      let unequippable = this.item.equipped;
      if (this.equippedItems) {
        unequippable = this.equippedItems[this.slot];
      } else {
        unequippable = this.$character.equipment[this.slot];
      }
      return unequippable && this.actions.equip && this.isEquipment;
    },
    maxSummons() {
      if (!this.isSummon) {
        return false;
      }

      return Math.floor(this.count / this.template.action.required);
    }
  },
  methods: {
    handleClose(response, ...args) {
      this.useCount = 1;
      if (this.$close) {
        this.$close(response, ...args);
      } else {
        this.$emit("close", this.item, response, ...args);
      }
    },
    statName(statId) {
      return Stat.toString(statId);
    }
  }
};
</script>

<style lang="less" scoped>
.stats {
  align-items: flex-start;
  margin-top: 1rem;
  padding-top: 1rem;

  > div {
    width: 40%;
  }
}

.loot-icon {
  margin-right: 10px;
}

.progress-bar-margin {
  margin-top: 1rem;
  margin-left: 10rem;
}

.info {
  justify-content: space-between;
}

.loot-desc {
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  color: #dcb850;
}

.stat-container {
  margin-top: 0.4rem;
}

.hint-header {
  border-bottom: 0.2rem solid #949a8e;
  padding-bottom: 1rem;
  border-image-outset: calc(1rem + 1px);
  border-image-width: 0 0 0.8rem 0;
}
</style>
