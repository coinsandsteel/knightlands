<template>
  <div class="dummy-height flex flex-column width-100 height-100">
    <keep-alive>
      <FightView
        class="height-100"
        v-if="fight"
        :meta="fightMeta"
        :state="fight"
        :trialIndex="trialIndex"
        :trialType="trialType"
        :trialMeta="trialMeta"
        @win="handleFightFinished(true)"
        @lose="handleFightFinished(false)"
      ></FightView>
      <div class="width-100" v-bar v-else>
        <div>
          <div class="padding-top-2">
            <TrialFightListElement
              v-for="(fight, index) in stage.fights"
              :key="`${fight.id}_${lastClearedFight}`"
              :fight="fight"
              :index="index"
              :completed="index < lastClearedFight + 1"
              :locked="index > lastClearedFight + 1"
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
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [PromptMixin],
  props: [
    "stage",
    "state",
    "fightState",
    "trialIndex",
    "trialType",
    "trialMeta"
  ],
  components: { TrialFightListElement, FightView },
  data: () => ({
    fight: null,
    lastClearedFight: -1
  }),
  watch: {
    fightState: {
      handler() {
        if (this.fightState) {
          // open fight
          this.fight = this.fightState;
        }
      },
      immediate: true
    },
    "state.cleared": {
      handler() {
        if (this.cleared) {
          this.$emit("cleared");
        }
      },
      immediate: true
    },
    "state.finishedFights": {
      handler() {
        this.refresh();
      },
      immediate: true
    }
  },
  activated() {
    this.refresh();
  },
  computed: {
    cleared() {
      return this.state && this.state.cleared && !this.state.collected;
    },
    fightMeta() {
      if (!this.fight) {
        return null;
      }

      return this.stage.fights.find(f => f.id == this.fight.id);
    }
  },
  methods: {
    refresh() {
      this.lastClearedFight = -1;

      if (this.state) {
        for (let i = 0; i < this.stage.fights.length; ++i) {
          const fight = this.stage.fights[i];
          if (this.state.finishedFights[fight.id]) {
            this.lastClearedFight++;
          } else {
            break;
          }
        }
      }
    },
    engage(fightIndex) {
      this.$emit("engage", this.stage.id, fightIndex);
    },
    handleFightFinished(win) {
      this.fight = null;

      if (this.cleared) {
        return;
      }

      let title, message;
      if (win) {
        title = "trial-fight-win-t";
        message = "trial-fight-win-m";
      } else {
        title = "trial-fight-lose-t";
        message = "trial-fight-lose-m";

        this.showPrompt(this.$t(title), this.$t(message), [
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: "ok"
          }
        ]);
      }

      this.refresh();
    }
  }
};
</script>
