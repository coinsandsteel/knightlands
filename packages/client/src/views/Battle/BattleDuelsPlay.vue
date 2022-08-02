<template>
  <div v-if="isActive && isStarted">
    <BattlePlayResult v-if="isResultVisible" />
    <BattlePlayField v-else />
  </div>
</template>
<script>
import { mapState } from "vuex";
import ActivityMixin from "@/components/ActivityMixin.vue";
import BattlePlayField from "@/views/Battle/BattlePlayField.vue";
import BattlePlayResult from "@/views/Battle/BattlePlayResult.vue";
export default {
  mixins: [ActivityMixin],
  components: {
    BattlePlayField,
    BattlePlayResult
  },
  data() {
    return {
      isResultVisible: false
    };
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    isStarted() {
      return this.game.combat.started;
    }
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
