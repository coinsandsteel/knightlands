<template>
  <div class="flex flex-column flex-no-wrap relative item-info-container">
    <span
      class="title font-size-20 margin-bottom-1"
      :class="`rarity-${template.rarity}`"
      v-if="!hideTitle"
    >{{$t(template.caption)}}</span>

    <loot
      class="loot-icon hintFix margin-left-1"
      :class="{'offset-loot': !hideTitle}"
      :item="item"
      :interactible="false"
      v-bind="lootProps"
    ></loot>

    <div class="flex flex-center font-size-20">
      <span :class="{'margin-right-1': !hasElement}">{{type}}</span>
      <div v-if="hasElement" :class="elementIcon" class="big"></div>
      <slot name="afterType"></slot>
    </div>

    <slot name="beforeStats"></slot>

    <slot name="stats">
      <div
        class="item-info-stats margin-bottom-2 margin-top-1 flex flex-center font-size-20 flex-space-evenly"
      >
        <div class="flex width-40 flex-column flex-item-end text-align-right">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >{{$t(statId)}}</div>
        </div>
        <div class="flex width-40 flex-column text-align-left">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >{{statValue}}</div>
        </div>
      </div>
    </slot>

    <slot name="afterStats"></slot>

    <ItemProperties v-if="!onlyStats" :item="item">
    </ItemProperties>

    <span
      class="loot-desc desc-font font-size-20 margin-bottom-1"
      v-if="!onlyStats && desc"
    >{{desc}}</span>

    <span
      class="loot-desc desc-font font-size-20"
      v-if="!onlyStats && isOffHand"
    >{{$t(`${template.equipmentType}-bonus`)}}</span>
  </div>
</template>

<script>
const ItemActions = require("@/../knightlands-shared/item_actions");
import ItemProperties from "@/components/ItemProperties.vue";
import Loot from "@/components/Loot.vue";
const ItemType = require("@/../knightlands-shared/item_type");
const {
  EquipmentSlots,
  getSlot
} = require("@/../knightlands-shared/equipment_slot");
import RaidsMeta from "@/raids_meta";

export default {
  props: {
    item: [Object, Number],
    hideTitle: Boolean,
    onlyStats: Boolean,
    lootProps: Object
  },
  components: { Loot, ItemProperties },
  computed: {
    isOffHand() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      return getSlot(this.template.equipmentType) == EquipmentSlots.OffHand;
    },
    template() {
      return this.$game.itemsDB.getTemplate(this.item);
    },
    elementIcon() {
      return `icon-${this.template.element}`;
    },
    hasElement() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      if (getSlot(this.template.equipmentType) != EquipmentSlots.MainHand) {
        return false;
      }

      return this.template.element != "physical";
    },
    desc() {
      return this.$t(this.template.description, "");
    },
    type() {
      let type = this.template.type;
      if (this.template.type == ItemType.Equipment) {
        type = this.template.equipmentType;
      }

      return `${this.$t(this.template.rarity)} ${this.$t(type)}`;
    },
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    }
  }
};
</script>

<style lang="less" scoped>
.item-info-stats {
  align-items: flex-start;
  padding-top: 1rem;

  & > div {
    white-space: nowrap;
  }
}

.loot-desc {
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  color: #dcb850;
}

.loot-icon {
  position: absolute;
  left: 0;
  top: 0;

  &.offset-loot {
    top: 3rem;
  }
}

.item-info-container {
  min-height: 10rem;
}
</style>