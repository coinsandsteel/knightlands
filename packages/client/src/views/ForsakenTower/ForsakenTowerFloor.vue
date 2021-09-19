<template>
  <div
    class="relative flex flex-column flex-center flex-no-wrap height-100"
    v-bar
  >
    <div class="width-100">
      <Title class="enemy-title-font font-outline" :stackBottom="true">{{
        name
      }}</Title>
      <EnemyView
        ref="enemyView"
        :image="enemyImage"
        background="/images/castle.png"
      >
        <FloatingTextContainer
          ref="floatingText"
          :enemyView="$refs.enemyView"
          class="absolute-stretch"
        ></FloatingTextContainer>
      </EnemyView>

      <div class="color-panel-1 flex flex-column width-100 padding-1">
        <span class="margin-top-1 margin-bottom-1 font-size-22">{{
          $t("tower-enemy-hp")
        }}</span>
        <ProgressBar
          :thresholds="barThreshold"
          v-model="enemyHealth"
          :maxValue="floor.maxHealth"
        ></ProgressBar>

        <span class="margin-top-3 margin-bottom-1 font-size-22">{{
          $t("tower-player-hp")
        }}</span>
        <ProgressBar
          v-model="playerHealth"
          :maxValue="floor.userMaxHealth"
        ></ProgressBar>

        <div v-if="lost" class="flex margin-top-2 width-100 flex-center">
          <PromisedButton
            :promise="request"
            @click="close(true)"
            width="15rem"
            type="red"
            >{{ $t("continue") }}</PromisedButton
          >
        </div>

        <div
          v-else-if="!finished"
          class="flex margin-top-3 flex-center width-100 flex-space-evenly"
        >
          <AttackButton
            :promise="request"
            @click="start"
            width="15rem"
            type="yellow"
            >{{ $t("q-prog-s") }}</AttackButton
          >

          <PromisedButton
            @click="stop"
            width="15rem"
            type="red"
            :disabled="paused"
            >{{ $t("q-prog-m") }}</PromisedButton
          >

          <PromisedButton @click="cancel" width="15rem" type="grey">{{
            $t("btn-leave")
          }}</PromisedButton>
        </div>

        <div v-else class="flex margin-top-2 width-100 flex-center">
          <PromisedButton
            :promise="request"
            @click="collect"
            width="15rem"
            type="green"
            >{{ $t("claim-reward") }}</PromisedButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EnemyView from "@/components/EnemyView.vue";
import FloatingTextContainer from "@/components/FloatingTextContainer.vue";
import TowerMeta from "@/tower_meta";
import PromisedButton from "@/components/PromisedButton.vue";
import AttackButton from "@/components/AttackButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import UiConstants from "@/ui_constants";
import PromptMixin from "@/components/PromptMixin.vue";
import Title from "@/components/Title.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

import { create } from "vue-modal-dialogs";
import ClaimedReward from "./ClaimedReward.vue";

const ShowRewards = create(ClaimedReward, "rewards", "raidTemplateId");

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  props: ["floor"],
  components: {
    EnemyView,
    FloatingTextContainer,
    PromisedButton,
    ProgressBar,
    AttackButton,
    Title
  },
  data: () => ({
    request: null,
    barThreshold: UiConstants.progressThresholds,
    enemyHealth: 0,
    playerHealth: 0,
    paused: true
  }),
  watch: {
    floor() {
      this.setHealth();
    }
  },
  activated() {
    this.setHealth();
  },
  deactivated() {
    this.stop();
  },
  mounted() {
    this.setHealth();
    this._onLevelUp = async () => {
      this.stop();
    };
    this.$game.on("level-up", this._onLevelUp);
  },
  destroyed() {
    this.$game.off("level-up", this._onLevelUp);
  },
  computed: {
    name() {
      return this.$t("tower-floor-title", { floor: this.floor.id + 1 });
    },
    enemyImage() {
      return TowerMeta.enemies[this.floor.id % TowerMeta.enemies.length].image;
    },
    finished() {
      return this.enemyHealth <= 0;
    },
    lost() {
      return this.playerHealth <= 0;
    }
  },
  methods: {
    start() {
      if (!this.paused) {
        return;
      }

      this.paused = false;
      if (!this._autoCombat) {
        this.autoCombat();
      }
    },
    stop() {
      if (this.paused) {
        return;
      }

      this.paused = true;
    },
    async autoCombat() {
      if (this.paused) {
        this._autoCombat = null;
        return;
      }

      await this.attack();

      if (this.lost || this.finished) {
        this._autoCombat = null;
        return;
      }

      this._autoCombat = setTimeout(() => {
        this.autoCombat();
      }, 500);
    },
    setHealth() {
      this.enemyHealth = this.floor.health;
      this.playerHealth = this.floor.userHealth;
    },
    async collect() {
      this.request = this.$game.claimTowerFloorRewards();

      const rewards = await this.request;
      if (rewards) {
        await ShowRewards(rewards);
        this.close(false);
      }
    },
    async attack() {
      this.request = await this.performRequest(this.$game.attackTowerFloor());

      const attackResult = await this.request;
      this.$refs.floatingText.addFloatingText(
        attackResult.damage,
        attackResult.crit
      );

      this.enemyHealth = attackResult.enemyHealth;
      this.playerHealth = attackResult.playerHealth;
    },
    async cancel() {
      this.stop();
      await this.performRequest(this.$game.cancelTowerFloor());
      this.close(true);
    },
    close(cancelled) {
      this.$emit("close", cancelled);
    }
  }
};
</script>
