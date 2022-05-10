<template>
  <div class="flex flex-column flex-full overflow-auto">
    <BattleZoneSelection />
    <div class="flex-full overflow-auto">
      <BattleAdventureItem v-for="item in battleItems" :key="item.id" />
    </div>
  </div>
</template>
<script>
import BattleZoneSelection from "@/views/Battle/BattleZoneSelection.vue";
import BattleAdventureItem from "@/views/Battle/BattleAdventureItem.vue";

export default {
  components: {
    BattleZoneSelection,
    BattleAdventureItem
  },
  data() {
    return {};
  },
  computed: {
    battleItems() {
      return [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 }
      ];
    }
  }
};
</script>
<style scoped lang="scss"></style>
