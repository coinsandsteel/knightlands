<template>
  <div class="dummy-height flex flex-column width-100">
    <keep-alive>
      <FightView
        v-if="fight"
        :meta="fightMeta"
        :state="fight"
        :trialIndex="trialIndex"
        :trialType="trialType"
      ></FightView>
      <div class="width-100" v-bar v-else>
        <div>
          <div>
            <TrialFightListElement
              v-for="(fight, index) in stage.fights"
              :key="fight.id"
              :fight="fight"
              :index="index"
              :locked="index != lastClearedFight+1"
              @engage="engage(index)"
            ></TrialFightListElement>
          </div>
        </div>
      </div>
    </keep-alive>
  </div>
</template>

<script>
import TrialFightListElement from "./TrialFightListElement.vue";
import FightView from "./FightView.vue";

export default {
  props: ["stage", "state", "fightState", "trialIndex", "trialType"],
  components: { TrialFightListElement, FightView },
  data: () => ({
    fight: null,
    lastClearedFight: -1
  }),
  activated() {
    this.lastClearedFight = -1;

    if (this.fightState) {
      // open fight
      this.fight = this.fightState;
    } else if (this.state) {
      for (let i = 0; i < this.stage.fights.length; ++i) {
        const fight = this.stage.fight[i];
        if (this.state.finishedFights[fight.id]) {
          this.lastClearedFight++;
        } else {
          break;
        }
      }
    }
  },
  computed: {
    fightMeta() {
      if (!this.fight) {
        return null;
      }

      return this.stage.fights.find(f => f.id == this.fight.id);
    }
  },
  methods: {
    engage(fightIndex) {
      this.$emit("engage", this.stage.id, fightIndex);
    }
  }
};
</script>