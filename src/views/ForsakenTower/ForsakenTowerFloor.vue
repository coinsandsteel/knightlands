<template>
  <div class="relative flex flex-column flex-center flex-no-wrap">
    <EnemyView ref="enemyView" :image="enemyImage" :name="name" background="/images/castle.png">
      <FloatingTextContainer ref="floatingText" :enemyView="$refs.enemyView" class="absolute-stretch"></FloatingTextContainer>
    </EnemyView>

    <ProgressBar
      valuePosition="top"
      valueClass="white-font font-outline font-size-25"
      :thresholds="barThreshold"
      v-model="enemyHealth"
      :maxValue="floor.maxHealth"
      height="1rem"
    ></ProgressBar>

    <div class="panel flex flex-column width-100 padding-1 margin-1">
      <span class="margin-top-1 margin-bottom-1 font-size-22">{{$t("tower-player-hp")}}</span>
      <ProgressBar v-model="playerHealth" :maxValue="floor.userMaxHealth"></ProgressBar>

      <div v-if="lost" class="flex margin-top-2 width-100 flex-center">
        <PromisedButton
          :promise="request"
          @click="close(true)"
          width="15rem"
          type="red"
        >{{$t("continue")}}</PromisedButton>
      </div>

      <div v-else-if="!finished" class="flex margin-top-2 flex-center width-100 flex-space-evenly">
        <AttackButton
          :promise="request"
          @click="attack"
          width="15rem"
          type="yellow"
        >{{$t("btn-attack")}}</AttackButton>

        <PromisedButton
          :promise="request"
          @click="cancel"
          width="15rem"
          type="red"
        >{{$t("btn-cancel")}}</PromisedButton>
      </div>

      <div v-else class="flex margin-top-2 width-100 flex-center">
        <PromisedButton
          :promise="request"
          @click="collect"
          width="15rem"
          type="green"
        >{{$t("claim-reward")}}</PromisedButton>
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

import { create } from "vue-modal-dialogs";
import ClaimedReward from "./ClaimedReward.vue";

const ShowRewards = create(ClaimedReward, ...ClaimedReward.props);

export default {
  mixins: [PromptMixin],
  props: ["floor"],
  components: { EnemyView, FloatingTextContainer, PromisedButton, ProgressBar, AttackButton },
  data: () => ({
    request: null,
    barThreshold: UiConstants.progressThresholds,
    enemyHealth: 0,
    playerHealth: 0
  }),
  watch: {
    floor() {
      this.setHealth();
    }
  },
  activated() {
    this.setHealth();
  },
  mounted() {
    this.setHealth();
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
      this.request = await this.$game.attackTowerFloor();

      const attackResult = await this.request;
      this.$refs.floatingText.addFloatingText(
        attackResult.damage,
        attackResult.crit
      );

      this.enemyHealth = attackResult.enemyHealth;
      this.playerHealth = attackResult.playerHealth;
    },
    async cancel() {
      await this.$game.cancelTowerFloor();
      this.close(true);
    },
    close(cancelled) {
      this.$emit("close", cancelled);
    }
  }
};
</script>