<template>
  <div class="flex flex-column flex-no-wrap relative item-info-container">
    <Title
      class="margin-bottom-1"
      :class="`rarity-${template.rarity}`"
      v-if="!hideTitle"
      >{{ $t(template.caption) }}</Title
    >

    <ItemHeader :item="item" :itemProps="lootProps" class="margin-left-1 margin-right-1">
      <template v-slot:level-bar>
        <slot name="level-bar"></slot>
      </template>
    </ItemHeader>

    <slot name="beforeStats"></slot>

    <slot name="stats" v-if="item">
      <ItemStats :item="item" />
    </slot>

    <slot name="afterStats"></slot>

    <ItemProperties :item="item" :onlyStats="onlyStats"></ItemProperties>

    <slot name="footer"></slot>
  </div>
</template>

<script>
import ItemProperties from "@/components/Item/ItemProperties.vue";
import ItemStats from "@/components/Item/ItemStats.vue";
import ItemHeader from "@/components/Item/ItemHeader.vue";
import Title from "@/components/Title.vue";

const ItemType = require("@/../../knightlands-shared/item_type");

const {
  EquipmentSlots,
  getSlot
} = require("@/../../knightlands-shared/equipment_slot");

export default {
  props: {
    item: [Object, Number],
    hideTitle: Boolean,
    onlyStats: Boolean,
    lootProps: Object,
    quantity: Number
  },
  components: { ItemProperties, Title, ItemHeader, ItemStats },
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
