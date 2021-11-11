<template>
  <div class="flex flex-column">
    <div class="flex flex-center">
      <Loot :item="template" class="margin-right-1" />
      <span :class="`rarity-${rarity}`" class="font-size-20 font-outline">{{
        $t(name)
      }}</span>
    </div>
    <ItemStats :item="template" />
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import ItemStats from "@/components/Item/ItemStats.vue";

export default {
  props: ["template"],
  components: { Loot, ItemStats },
  computed: {
    name() {
      return this.$game.itemsDB.getName(this.template);
    },
    rarity() {
      return this.$game.itemsDB.getRarity(this.template);
    }
  }
};
</script>
