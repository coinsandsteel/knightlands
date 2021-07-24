<template>
  <div class="flex flex-center font-size-18 flex-no-wrap">
    <div class="flex flex-center padding-1 panel-input height-100">
      <span>{{ $t(ticketItemName) }}</span>
      <div class="key-icon" :class="ticketIcon"></div>
      <span>{{ totalTickets }}</span>
      <span
        class="item-icon button_plus_footer margin-left-half pointer"
        @click="$emit('purchase')"
      ></span>
    </div>
  </div>
</template>

<script>
import TowerMeta from "@/tower_meta";
import InventoryListenerMixin from "@/components/InventoryListenerMixin.vue";

export default {
  mixins: [InventoryListenerMixin],
  data: () => ({
    totalTickets: 0
  }),
  mounted() {
    this.update();
  },
  computed: {
    ticketItemName() {
      return this.$game.itemsDB.getName(TowerMeta.ticketItem);
    },
    freeTickets() {
      return this.$game.freeAttempts;
    },
    ticketIcon() {
      return this.$game.itemsDB.getIcon(TowerMeta.ticketItem);
    }
  },
  methods: {
    handleInventoryChanged() {
      this.update();
    },
    update() {
      const towerItem = this.$game.inventory.getItemByTemplate(
        TowerMeta.ticketItem
      );

      if (towerItem) {
        this.totalTickets = towerItem.count + this.freeTickets;
      } else {
        this.totalTickets = this.freeTickets;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.key-icon {
  width: 3rem;
  height: 3rem;
}
</style>
