<template>
  <div
    class="april-tickets april-tickets--with-background font-size-20 flex flex-nowrap flex-items-center"
  >
    <div class="april-tickets-icons"></div>
    {{ tickets }}
  </div>
</template>
<script>
// @todo
import meta from "@/march_meta.json";

export default {
  props: ["value"],
  computed: {
    ticketsCount() {
      const itemsCount = this.$game.inventory.getItemsCountByTemplate(
        // @todo
        meta.marchTicket
      );

      return itemsCount || 0;
    },
    tickets() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.ticketsCount || 0;
    }
  }
};
</script>
<style scoped lang="less">
.april-tickets-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/april/april_tickets.png");
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-tickets--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>
