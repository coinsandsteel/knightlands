<template>
  <div class="screen-content flex-items-center full-flex" v-if="combat.enemyId">
    <div class="screen-background"></div>
    <div class="flex flex-column flex-center">
      <div
        :style="zoneBackground"
        class="flex quest-mid relative flex-center flex-no-wrap"
      >
        <div class="quest-image flex flex-column flex-center flex-end">
          <img ref="enemyView" :src="enemyImage" />
          <div
            class="
              flex flex-center flex-column
              font-outline font-size-30
              enemy-title
            "
          >
            <span class="rarity-mythical font-weight-900 font-outline">{{
              $t("floor", { val: maze.floor })
            }}</span>
            <div>
              <span class="enemy-title-font capitalize">{{
                $t(missionName)
              }}</span>
            </div>
          </div>
        </div>

        <div class="absolute-stretch z-index-100 pointer-events-none ">
          <SoundEffect
            ref="fx"
            :files="[
              'hit1',
              'hit2',
              'hit3',
              'hit4',
              'hit5',
              'hit6',
              'hit7',
              'hit8'
            ]"
          />
          <span class="move font-outline font-weight-900" ref="moveHandle">{{
            $t(move)
          }}</span>
        </div>
      </div>

      <div class="color-panel-1 flex flex-column full-flex">
        <progress-bar
          :percentMode="false"
          v-model="currentProgress"
          :maxValue="maxProgress"
          height="4px"
          width="80%"
          valuePosition="top"
          barType="yellow"
          valueClass="white-font font-outline font-size-30 quest-progress-value"
          :thresholds="thresholds"
        ></progress-bar>

        <progress-bar
          :percentMode="false"
          v-model="user.health"
          :maxValue="stats.maxHealth"
          height="4px"
          width="80%"
          valuePosition="top"
          barType="red"
          valueClass="white-font font-outline font-size-30 quest-progress-value margin-top-2"
        ></progress-bar>

        <div class="margin-top-2 flex flex-center">
          <CustomButton
            :promise="request"
            minWidth="15rem"
            type="grey"
            :noSound:="true"
            @click="engage(moves.Scissors)"
            id="engage-q"
          >
            <span>{{ $t("d-attack") }}</span></CustomButton
          >
          <CustomButton
            :promise="request"
            minWidth="15rem"
            type="grey"
            :noSound:="true"
            @click="engage(moves.Paper)"
            id="engage-q"
          >
            <span>{{ $t("d-block") }}</span></CustomButton
          >
          <CustomButton
            :promise="request"
            minWidth="15rem"
            type="grey"
            :noSound:="true"
            @click="engage(moves.Rock)"
            id="engage-q"
          >
            <span>{{ $t("d-parry") }}</span></CustomButton
          >
        </div>
      </div>

      <Equipment class="margin-top-5" />
    </div>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import UiConstants from "@/ui_constants";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CustomButton from "@/components/Button.vue";
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import Equipment from "./equipment/Equipment.vue";

import { create } from "vue-modal-dialogs";
import { MoveType } from "@/../../knightlands-shared/dungeon_types";

import anime from "animejs/lib/anime.es.js";
import { mapGetters, mapState } from "vuex";

const CombatOutcome = {
  EnemyWon: -1,
  PlayerWon: 1,
  NobodyWon: 0
};

export default {
  name: "dungeon-fight",
  mixins: [HintHandler, NetworkRequestErrorMixin, AppSection, PromptMixin],
  props: ["zone", "questIndex", "maxQuestIndex", "stage"],
  components: {
    Equipment,
    ProgressBar,
    IconWithValue,
    CustomButton,
    SoundEffect
  },
  data: () => ({
    moves: MoveType,
    rewards: [],
    newRewards: [],
    lootHash: {},
    thresholds: UiConstants.progressThresholds,
    request: null,
    move: ""
  }),
  created() {
    this.title = "dungeon-fight";
  },
  mounted() {
    this.damageTextId = 0;
    if (!this.combat.enemyId) {
      this.leave();
    }
  },
  deactivated() {
    this.rewards = [];
    this.newRewards = [];
    this.lootHash = {};
    this.playerDamages = [];
  },
  computed: {
    ...mapState({
      combat: state => state.dungeon.combat,
      user: state => state.dungeon.user,
      maze: state => state.dungeon.maze
    }),
    ...mapGetters({
      enemy: "dungeon/enemy",
      stats: "dungeon/playerStats"
    }),
    enemyImage() {
      return `/images/enemies/${this.enemy.image}.png`;
    },
    maxProgress() {
      return this.progress.max;
    },
    currentProgress() {
      return this.progress.current;
    },
    progress() {
      return {
        max: this.enemy.health,
        current: this.combat.enemyHealth
      };
    },
    zoneBackground() {
      return 'background-image: url("/images/zones/dragons.jpg");';
    },
    missionName() {
      return this.enemy.label;
    }
  },
  watch: {
    "combat.outcome"(value) {
      if (value === CombatOutcome.EnemyWon) {
        this.combatLost();
      } else if (value === CombatOutcome.PlayerWon) {
        this.combatWon();
      }
    },
    "combat.enemyHealth"(current, previous) {
      const damage = previous - current;
      if (damage > 0) {
        this.$refs.fx.play();
      }
    }
  },
  methods: {
    combatLost() {
      alert("You lost the combat!");
      this.$store.dispatch("dungeon/resetCombat");
      this.leave();
    },
    combatWon() {
      alert("You won the combat!");
      this.$store.dispatch("dungeon/resetCombat");
      this.leave();
    },
    leave() {
      this.$router.push({ name: "dungeon" });
    },
    async engage(move) {
      const outcomes = await this.performRequest(
        this.$store.dispatch("dungeon/combat", move)
      );

      let moveStr = "default";
      switch (outcomes.enemyMove) {
        case MoveType.Scissors:
          moveStr = "d-attack";
          break;
        case MoveType.Paper:
          moveStr = "d-block";
          break;
        case MoveType.Rock:
          moveStr = "d-parry";
          break;
      }

      this.move = moveStr;

      anime.remove(this.$refs.moveHandle);

      let timeline = anime.timeline({
        targets: this.$refs.moveHandle
      });

      timeline.add({
        "font-size": "1rem",
        duration: 0
      });

      timeline.add({
        duration: 600,
        easing: "easeOutElastic",
        "font-size": `8rem`,
        opacity: 1
      });

      timeline.add({
        duration: 500,
        "font-size": `8rem`
      });

      timeline.add({
        easing: "easeOutCubic",
        duration: 1000,
        "font-size": `8rem`,
        opacity: 0
      });
    }
  }
};
</script>

<style lang="less" scoped>
.quest-mid {
  width: 100%;
  height: 30vh;
  min-height: 30vh;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 1rem;
}

.quest-enemies {
  height: 80%;
  width: 100%;
}

.quest-image {
  width: 100vw;
  padding-bottom: 1rem;
  height: 100%;

  & img {
    max-width: 100%;
    max-height: 100%;
  }
}

.quest-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.enemy-title {
  padding: 1rem;
  background-color: #0d00287d;
  border-radius: 2px;
  position: absolute;
  top: 0;
  z-index: 98;
}

.move {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
