<template>
  <div class="flex-full overflow-auto">
    Battle squad warehouse
    <BattleUnitList :units="units" @click="clickHandler" />
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
  },
  methods: {
    clickHandler() {
      this.$router.push({ name: "battle-squad-unit", params: { id: 123 } });
    }
  }
};
</script>
<style scoped lang="scss"></style>
