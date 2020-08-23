<template>
  <div
    class="flex flex-space-evenly flex-no-wrap relative padding-top-2 padding-bottom-1"
  >
    <div class="close-btn" @click="$emit('close')"></div>
    <ItemInfo
      class="width-70"
      :item="item"
      :hideTitle="true"
      :lootProps="{ equipment: true, equipmentSlot: itemSlot }"
    >
    </ItemInfo>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import ItemInfo from "@/components/ItemInfo.vue";

export default {
  props: ["itemSlot"],
  components: {
    Loot,
    ItemInfo
  },
  computed: {
    item() {
      return this.$character.equipment[this.itemSlot];
    }
  }
};
</script>
