<template>
  <div class="flex flex-center font-size-18 flex-no-wrap">
    <div class="flex flex-center padding-1 panel-input height-100">
      <span>{{$t(ticketItemName)}}</span>
      <div class="key-icon" :style="ticketIcon"></div>
      <span>{{totalTickets}}</span>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import TowerMeta from "@/tower_meta";

export default {
  computed: {
    ticketItemName() {
      return this.$game.itemsDB.getName(TowerMeta.ticketItem);
    },
    totalTickets() {
      return (
        this.$game.inventory.getItemsCountByTemplate(TowerMeta.ticketItem) +
        this.freeTickets
      );
    },
    freeTickets() {
      return this.$game.towerFreeAttempts();
    },
    ticketIcon() {
      return `background-image: url(${this.$game.itemsDB.getIcon(
        TowerMeta.ticketItem
      )});`;
    }
  }
};
</script>

<style lang="less" scoped>
.key-icon {
  background-repeat: no-repeat;
  background-size: contain;
  width: 3rem;
  height: 3rem;
}
</style>