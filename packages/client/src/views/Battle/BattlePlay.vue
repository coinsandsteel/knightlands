<template>
  <div class="screen-content overflow-auto" v-if="true || loaded">
    <BattlePlayField />
  </div>
</template>
<script>
import BattlePlayField from "@/views/Battle/BattlePlayField.vue";

export default {
  components: {
    BattlePlayField
  },
  data() {
    return {
      loaded: true
    };
  }
};
</script>
<style scoped lang="less"></style>
