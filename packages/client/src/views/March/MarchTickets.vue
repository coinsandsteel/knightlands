<template>
  <div
    class="march-tickets march-tickets--with-background font-size-20 flex flex-nowrap flex-items-center"
  >
    <div class="march-tickets-icons"></div>
    {{ tickets }}
  </div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {};
  },
  computed: {
    ticketsCount() {
      // let items = this.$game.inventory.items.filter(({ template }) => {
      //   return template === 3461;
      // });

      // console.log("items", items);

      // return items && items.length > 0 ? 0 : 0;
      const itemsCount = this.$game.inventory.getItemsCountByTemplate(3461);

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
.march-tickets-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/march/march_tickets.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.march-tickets--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>
