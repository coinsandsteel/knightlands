<template>
  <div class="flex flex-item-center pointer" @click="clickHandler">
    <BattleUnit :unit="unit" />
    <div class="padding-left-1">Exp: 1234</div>
    <div class="padding-left-4">Ability 1, Ability 2, Ability 3</div>
  </div>
</template>
<script>
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  components: {
    BattleUnit
  },
  props: {
    unit: Object
  },
  data() {
    return {};
  },
  methods: {
    clickHandler() {
      this.$emit("click", this.unit);
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit {
  width: 60px;
}
</style>
