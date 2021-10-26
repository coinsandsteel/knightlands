<template>
  <div class="screen-content flex-items-center full-flex" v-if="combat.enemyId">
    <div class="screen-background"></div>
    <div class="flex flex-column flex-center">
      <div
        :style="zoneBackground"
        class="flex quest-mid relative flex-center flex-no-wrap"
      >
        <div class="quest-image flex flex-column flex-center flex-start">
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

        <div class="absolute-stretch z-index-100 pointer-events-none">
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
              'hit8',
            ]"
          />
          <DamageText
            v-for="damage in playerDamages"
            :local="true"
            :key="damage.id"
            :crit="damage.crit"
            >{{ damage.damage }}</DamageText
          >
          <NewLoot
            v-for="reward in newRewards"
            :key="reward.id"
            :item="reward"
            :delay="reward.delay"
          >
          </NewLoot>
        </div>
      </div>

      <div class="color-panel-1 flex flex-column full-flex">
        <progress-bar
          :percentMode="true"
          v-model="currentProgress"
          :maxValue="maxProgress"
          height="4px"
          width="80%"
          valuePosition="top"
          barType="yellow"
          valueClass="white-font font-outline font-size-30 quest-progress-value"
          :thresholds="thresholds"
        ></progress-bar>

        <div v-if="false" class="flex margin-top-2">
          <div
            class="
              width-50
              font-size-25
              flex flex-column flex-center flex-justify-start
            "
          >
            <span class="margin-bottom-1 yellow-title font-weight-900">{{
              $t("rewards")
            }}</span>
            <div class="flex flex-column flex-start">
              <icon-with-value
                class="flex-start"
                iconClass="icon-gold"
                :value="5000"
              ></icon-with-value>
            </div>
          </div>
          <div
            class="
              width-50
              font-size-25
              flex flex-column flex-center flex-justify-start
            "
          >
            <span class="margin-bottom-1 blue-title font-weight-900">Cost</span>
            <div class="flex flex-column">
              <icon-with-value
                class="flex-start"
                iconClass="icon-energy"
                :value="20"
              ></icon-with-value>
            </div>
          </div>
        </div>

        <div class="margin-top-2 flex flex-center">
          <AttackButton
            :promise="request"
            minWidth="15rem"
            type="yellow"
            :noSound:="true"
            @click="engage(moves.Scissors)"
            id="engage-q"
          >
            <span>{{ $t("btn-attack") }}</span></AttackButton
          >
          <AttackButton
            :promise="request"
            minWidth="15rem"
            type="yellow"
            :noSound:="true"
            @click="engage(moves.Paper)"
            id="engage-q"
          >
            <span>{{ $t("btn-block") }}</span></AttackButton
          >
          <AttackButton
            :promise="request"
            minWidth="15rem"
            type="yellow"
            :noSound:="true"
            @click="engage(moves.Rock)"
            id="engage-q"
          >
            <span>{{ $t("btn-parry") }}</span></AttackButton
          >
        </div>
      </div>

      <div class="width-100 margin-top-2 margin-bottom-2">
        <ProgressBar
          :value="870"
          :maxValue="935"
          height="4px"
          width="90%"
          valuePosition="top"
          barType="blue"
          valueClass="white-font font-outline font-size-20"
        >
          <template v-slot:label>Dungeon Energy&nbsp;&ndash;&nbsp;</template>
        </ProgressBar>
      </div>

      <Title class="margin-top-2">{{ $t("loot") }}</Title>

      <div class="flex full-flex padding-left-1 padding-right-1 margin-top-1">
        <loot
          v-for="reward in rewards"
          :key="reward.id"
          :item="reward"
          @hint="handleHint"
        ></loot>
      </div>
    </div>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Loot from "@/components/Loot.vue";
import Stat from "@/../../knightlands-shared/character_stat.js";
import IconWithValue from "@/components/IconWithValue.vue";
import UiConstants from "@/ui_constants";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import AttackButton from "@/components/AttackButton.vue";
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import NewLoot from "@/components/Item/NewLoot.vue";
import DamageText from "@/views/Raids/DamageText.vue";
import Errors from "@/../../knightlands-shared/errors";
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";

import { create } from "vue-modal-dialogs";
import NotEnoughResource from "@/components/Modals/NotEnoughResource.vue";
import { MoveType } from "@/../../knightlands-shared/dungeon_types";

import anime from "animejs/lib/anime.es.js";
import { mapGetters, mapState } from 'vuex';

const ShowResourceRefill = create(NotEnoughResource, "stat");
const NEW_LOOT_DELAY = 300;

export default {
  name: "dungeon-fight",
  mixins: [HintHandler, NetworkRequestErrorMixin, AppSection],
  props: ["zone", "questIndex", "maxQuestIndex", "stage"], 
  components: {
    Loot,
    ProgressBar,
    IconWithValue,
    PromisedButton,
    CustomButton,
    DamageText,
    AttackButton,
    Title,
    NewLoot,
    SoundEffect,
  },
  data: () => ({
    moves: MoveType,
    rewards: [],
    newRewards: [],
    lootHash: {},
    thresholds: UiConstants.progressThresholds,
    request: null,
    playerDamages: []
  }),
  created() {
    this.title = "dungeon-fight";
  },
  mounted() {
    this.damageTextId = 0;
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
      maze: state => state.dungeon.maze
    }),
    ...mapGetters({
      enemy: 'dungeon/enemy'
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
      return 'background-image: url("/images/zones/undead.jpg");';
    },
    missionName() {
      return this.enemy.label;
    },
  },
  methods: {
    async engage(move) {
      this.request = this.$store.dispatch("dungeon/combat", move);
      try {
        await this.request;
        let totalDamage = 0;
        let isCrit = false;
        for (let i = 0; i < 2; ++i) {
          isCrit |= true;
          totalDamage += 30;
        }

        if (totalDamage > 0) {
          this.$refs.fx.play();
          this.handleDamage(totalDamage, isCrit, 0);
        }

        //this.handleLoot(items);
      } catch (exc) {
        await this._handleQuestError(exc);
      }
    },
    handleLoot(lootDrop) {
      let delay = 0;
      for (let loot of lootDrop) {
        const templateId = loot.item;
        // if already was dropped before - just inc loot counter
        if (this.lootHash[templateId]) {
          this.lootHash[templateId].count += loot.quantity;
        } else {
          // or add to loot array and hash for tracking
          this.$set(this.lootHash, templateId, {
            template: loot.item,
            count: loot.quantity,
          });
          this.rewards.push(this.lootHash[templateId]);
        }

        this.showNewLoot(loot, delay);
        delay += NEW_LOOT_DELAY;
      }
    },
    async _handleQuestError(error) {
      // TODO test
      switch (error) {
        case Errors.NoHealth:
          await ShowResourceRefill(Stat.Health);
          break;

        case Errors.NoEnergy:
          await this.$app.tutorial().triggerEvent("no-energy");
          await ShowResourceRefill(Stat.Energy);
          break;

        case "enemy is defeated":
          this.$router.push({ name: "dungeon" });
          break;
      }
    },
    showNewLoot(loot, delay) {
      setTimeout(() => {
        this.newRewards.splice(0, 1);
      }, 3000);

      this.newRewards.push({
        template: loot.item,
        count: loot.quantity,
        delay,
      });
    },
    handleDamage(damage, crit, delay) {
      this.playerDamages.push({
        damage: damage,
        crit: crit,
        id: this.damageTextId++,
      });

      setTimeout(() => {
        this.playerDamages.splice(0, 1);
      }, 3000);

      const enemyView = this.$refs.enemyView[this.questIndex];
      anime.remove(enemyView);
      let timeline = anime.timeline({
        targets: enemyView,
      });

      if (crit) {
        timeline.add({
          translateX: function (el, i) {
            return `-=${anime.random(-1, -2)}rem`;
          },
          translateY: function (el, i) {
            return `-=${anime.random(-1, 1)}rem`;
          },
          scale: 1.2 + Math.random() * 0.2,
          duration: 0,
          loop: 1,
        });
      }

      timeline.add(
        {
          filter: "brightness(100)",
          duration: 0,
        },
        0
      );

      timeline.add({
        translateX: 0,
        translateY: 0,
        scale: 1,
        delay: delay,
        filter: {
          value: "brightness(1)",
          easing: "linear",
          duration: 100,
        },
      });
    }
  },
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
  bottom: 0;
  z-index: 98;
}
</style>
