<template>
  <div>
    <div>
      <div class="font-size-22">
        Your army
      </div>
      <div class="battle-unit-list">
        <BattleUnitList :units="fighters" />
      </div>
    </div>
    <div>
      <div class="font-size-22">
        Enemy 's army
      </div>
      <div class="battle-enemy-unit-list">
        <BattleUnitList :units="enemyFighters" />
      </div>
    </div>
    <div class="text-align-center">
      <CustomButton
        type="yellow"
        width="20rem"
        class="inline-block"
        @click="handleStart"
        >Start</CustomButton
      >
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
export default {
  components: {
    BattleUnitList
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game"]),
    fighters() {
      const result =
        this.game && this.game.userSquad && this.game.userSquad.fighters
          ? this.game.userSquad.fighters
          : [];

      const length = result.length;

      for (let i = 0; i < 5 - length; i++) {
        result.push(null);
      }

      return result;
    },
    enemyFighters() {
      const result =
        this.game && this.game.userSquad && this.game.userSquad.fighters
          ? this.game.userSquad.fighters
          : [];

      const length = result.length;

      for (let i = 0; i < 5 - length; i++) {
        result.push(null);
      }

      return result;
    }
  },
  methods: {
    async unitClickHandler() {
      const showDailyRewardsDialog = create(BattleUnitSelect);
      await showDailyRewardsDialog();
    },
    handleStart() {
      this.$store.dispatch("battle/enterLevel", {
        location: this.$route.params.id,
        level: null
      });
      this.$router.push({
        name: "battle-adventure-play",
        params: { unitId: this.$route.params.id }
      });
    }
  }
};
</script>
