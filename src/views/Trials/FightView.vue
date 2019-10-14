<template>
  <div class="relative flex flex-column flex-center flex-no-wrap">
    <EnemyView
      ref="enemyView"
      :image="enemyImage"
      :background="`/images/${background}`"
    >
      <FloatingTextContainer
        ref="floatingText"
        :enemyView="$refs.enemyView"
        class="absolute-stretch"
      ></FloatingTextContainer>
    </EnemyView>

    <ProgressBar
      valuePosition="top"
      valueClass="white-font font-outline font-size-25"
      :thresholds="barThreshold"
      v-model="enemyHealth"
      :maxValue="state.maxHealth"
      height="1rem"
    ></ProgressBar>

    <div class="panel flex flex-column width-100 padding-1 margin-1">
      <span class="margin-top-1 margin-bottom-1 font-size-22">{{$t("tower-player-hp")}}</span>
      <ProgressBar v-model="playerHealth" :maxValue="state.playerMaxHealth"></ProgressBar>

      <!-- <div v-if="lost" class="flex margin-top-2 width-100 flex-center">
        <PromisedButton
          :promise="request"
          @click="close(true)"
          :props="{width: '15rem', type:'red'}"
        >{{$t("continue")}}</PromisedButton>
      </div>-->

      <div class="flex margin-top-2 flex-center width-100 flex-space-evenly">
        <PromisedButton
          :promise="request"
          @click="attack"
          :props="{width: '15rem', type:'yellow'}"
        >{{$t("btn-attack")}}</PromisedButton>

        <!-- <PromisedButton
          :promise="request"
          @click="cancel"
          :props="{width: '15rem', type:'red'}"
        >{{$t("btn-cancel")}}</PromisedButton>-->
      </div>
      <!-- 
      <div v-else class="flex margin-top-2 width-100 flex-center">
        <PromisedButton
          :promise="request"
          @click="collect"
          :props="{width: '15rem', type:'green'}"
        >{{$t("claim-reward")}}</PromisedButton>
      </div>-->
    </div>
  </div>
</template>

<script>
import EnemyView from "@/components/EnemyView.vue";
import FloatingTextContainer from "@/components/FloatingTextContainer.vue";
import TrialBackground from "./trialBackgrounds";
import PromisedButton from "@/components/PromisedButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import UiConstants from "@/ui_constants";

export default {
  props: ["state", "meta", "trialIndex", "trialType"],
  components: { EnemyView, FloatingTextContainer, PromisedButton, ProgressBar },
  data: () => ({
    request: null,
    barThreshold: UiConstants.progressThresholds,
    enemyHealth: 0,
    playerHealth: 0
  }),
  computed: {
    background() {
      return TrialBackground.getBackground(this.trialType, this.trialIndex);
    },
    enemyImage() {
      return this.meta.image;
    }
  },
  activated() {
    this.enemyHealth = this.state.health;
    this.playerHealth = this.state.playerHealth;
  },
  methods: {
    async attack() {
      this.request = await this.$game.attackTrial(this.trialType);

      const attackResult = await this.request;
      this.$refs.floatingText.addFloatingText(
        attackResult.damage,
        attackResult.crit
      );

      this.enemyHealth = attackResult.enemyHealth;
      this.playerHealth = attackResult.playerHealth;
    }
  }
};
</script>