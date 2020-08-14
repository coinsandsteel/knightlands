<template>
  <div class="flex flex-center">
    <div class="flex flex-center" v-for="item in resources" :key="item.item">
      <Loot class="margin-right-half" size="mini" :item="item" :hideQuantity="true" />
      <span class="panel-input padding-1 margin-right-1 font-size-18">{{currentCount(item)}}</span>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";

export default {
  props: ["resources"],
  components: { Loot },
  methods: {
    currentCount(itemId) {
      return this.$game.inventory.getItemsCountByTemplate(itemId);
    }
  }
};
</script>
