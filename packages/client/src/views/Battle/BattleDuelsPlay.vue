<template>
  <div>
    <BattlePlayResult v-if="isResultVisible" />
    <BattlePlayField v-else />
  </div>
</template>
<script>
import BattlePlayField from "@/views/Battle/BattlePlayField.vue";
import BattlePlayResult from "@/views/Battle/BattlePlayResult.vue";
export default {
  components: {
    BattlePlayField,
    BattlePlayResult
  },
  data() {
    return {
      isResultVisible: true
    };
  }
};
</script>
<style scoped lang="less"></style>
