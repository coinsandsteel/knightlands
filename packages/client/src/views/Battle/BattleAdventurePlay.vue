<template>
  <div v-if="isActive && isStarted">
    <BattlePlayField />
  </div>
</template>
<script>
import { mapState } from "vuex";
import ActivityMixin from "@/components/ActivityMixin.vue";
import BattlePlayField from "@/views/Battle/BattlePlayField.vue";
export default {
  mixins: [ActivityMixin],
  components: {
    BattlePlayField
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    isStarted() {
      return this.game.combat.started;
    }
    // isResultVisible() {
    //   return !!this.game.combat.result;
    // }
  },
  watch: {
    isStarted(value, oldValue) {
      if (this.isActive && oldValue === true && value === false) {
        this.$router.replace({ name: "battle-menu" });
      }
    }
  },
  mounted() {
    if (!this.isStarted) {
      this.$router.replace({ name: "battle-menu" });
      return;
    }
  }
};
</script>
<style scoped lang="less"></style>
