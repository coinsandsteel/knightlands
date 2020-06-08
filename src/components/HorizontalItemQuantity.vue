<template>
  <div class="flex flex-center">
    <div class="flex flex-center" v-for="item in items" :key="item.item">
      <Loot class="margin-right-half" :gacha="true" :item="item.item" :hideQuantity="true" />
      <span
        class="panel-input padding-1 margin-right-1 font-size-18"
        :class="{'rarity-mythical': notEnoughItems(item.item, item.quantity)}"
      >{{item.quantity}}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";

export default {
  props: ["items"],
  components: { Loot },
  methods: {
    notEnoughItems(template, quantity) {
      return !this.$game.inventory.hasItemByTemplate(template, quantity);
    }
  }
};
</script>
