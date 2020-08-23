<template>
  <div class="flex flex-column flex-no-wrap relative item-info-container">
    <Title
      class="margin-bottom-1"
      :class="`rarity-${template.rarity}`"
      v-if="!hideTitle"
      >{{ $t(template.caption) }}</Title
    >

    <ItemHeader :item="item" :itemProps="lootProps"></ItemHeader>

    <slot name="beforeStats"></slot>

    <slot name="stats" v-if="item">
      <div
        class="item-info-stats margin-bottom-2 margin-top-1 flex flex-center font-size-20 flex-space-evenly"
      >
        <div class="flex width-45 flex-column text-align-right">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >
            {{ $t(statId) }}
          </div>
        </div>
        <div class="flex width-45 flex-column text-align-left">
          <div
            v-for="(statValue, statId) in stats"
            :key="statId"
            class="margin-bottom-half width-100"
          >
            {{ statValue }}
          </div>
        </div>
      </div>
    </slot>

    <slot name="afterStats"></slot>

    <ItemProperties v-if="!onlyStats && item" :item="item"></ItemProperties>

    <span
      class="loot-desc desc-font font-size-20 margin-bottom-1"
      v-if="!onlyStats && desc && item"
      >{{ desc }}</span
    >

    <span
      class="loot-desc desc-font font-size-20"
      v-if="!onlyStats && isOffHand && item"
      >{{ $t(`${template.equipmentType}-bonus`) }}</span
    >
  </div>
</template>

<script>
import ItemProperties from "@/components/ItemProperties.vue";
const ItemType = require("@/../../knightlands-shared/item_type");
import Title from "@/components/Title.vue";
const {
  EquipmentSlots,
  getSlot
} = require("@/../../knightlands-shared/equipment_slot");

import ItemHeader from "@/components/Item/ItemHeader.vue";

export default {
  props: {
    item: [Object, Number],
    hideTitle: Boolean,
    onlyStats: Boolean,
    lootProps: Object,
    quantity: Number
  },
  components: { ItemProperties, Title, ItemHeader },
  computed: {
    isOffHand() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      return getSlot(this.template.equipmentType) == EquipmentSlots.OffHand;
    },
    template() {
      if (!this.item) {
        return {};
      }
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
      if (!this.item) {
        return [];
      }
      return this.$game.itemsDB.getStats(this.item);
    },
    stars() {
      return this.item.breakLimit;
    }
  },
  methods: {
    upgradeItem() {
      this.$router.push({
        name: "unbind-item",
        params: { itemId: this.item.id }
      });
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
