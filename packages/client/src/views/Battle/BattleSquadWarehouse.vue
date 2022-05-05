<template>
  <div>
    Battle squad warehouse
    <BattleUnitList :units="units" />
  </div>
</template>
<script>
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
export default {
  components: {
    BattleUnitList
  },
  data() {
    return {};
  },
  computed: {
    units() {
      const result = [];
      for (let i = 0; i < 42; i++) {
        result.push({
          id: i + 1
        });
      }

      return result;
    }
  }
};
</script>
<style scoped lang="scss"></style>
