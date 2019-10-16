<template>
  <div class="relative flex flex-column flex-center flex-no-wrap">
    <EnemyView ref="enemyView" :image="enemyImage" :background="`/images/${background}`">
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
      <ProgressBar v-model="playerHealth" :maxValue="state.maxPlayerHealth"></ProgressBar>

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

    <portal to="overlay" :slim="true">
      <CardSelector
        v-show="cards"
        :cards="cards"
        :fightMeta="additionalFightMeta"
        :trialType="trialType"
        @cardEffect="handleCardEffect"
      ></CardSelector>
    </portal>
  </div>
</template>

<script>
import EnemyView from "@/components/EnemyView.vue";
import FloatingTextContainer from "@/components/FloatingTextContainer.vue";
import TrialBackground from "./trialBackgrounds";
import PromisedButton from "@/components/PromisedButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import UiConstants from "@/ui_constants";
import CardSelector from "./Cards/CardSelector.vue";
import TrialCardsEffect from "@/../knightlands-shared/trial_cards_effect";

export default {
  props: ["state", "meta", "trialIndex", "trialType", "trialMeta"],
  components: {
    EnemyView,
    FloatingTextContainer,
    PromisedButton,
    ProgressBar,
    CardSelector
  },
  data: () => ({
    request: null,
    barThreshold: UiConstants.progressThresholds,
    enemyHealth: 0,
    playerHealth: 0,
    cards: null,
    additionalFightMeta: null
  }),
  computed: {
    background() {
      return TrialBackground.getBackground(this.trialType, this.trialIndex);
    },
    enemyImage() {
      return this.meta.image;
    },
    fightMeta() {
      return this.trialMeta.stages.find(s => s.id == this.state.stageId).fights[
        this.state.index
      ];
    }
  },
  watch: {
    enemyHealth() {
      if (this.enemyHealth <= 0) {
        this.$emit("win");
      }
    },
    playerHealth() {
      if (this.playerHealth <= 0) {
        this.$emit("lose");
      }
    }
  },
  activated() {
    this.enemyHealth = this.state.health;
    this.playerHealth = this.state.playerHealth;
    this.cards = this.state.cards;
    this.additionalFightMeta = null;
    this.fetchRemoteData();
  },
  methods: {
    async fetchRemoteData() {
      this.request = this.$game.fetchTrialFightMeta(
        this.trialType,
        this.trialMeta.id,
        this.state.stageId,
        this.state.index
      );
      this.additionalFightMeta = await this.request;
    },
    handleCardEffect(cardEffectData) {
      this.cards = null;
      const modValue = cardEffectData.value;

      switch (cardEffectData.effect) {
        case TrialCardsEffect.DamageEnemy:
          this.enemyHealth -= modValue;
          this.$refs.floatingText.addFloatingText(modValue, true);
          break;

        case TrialCardsEffect.DamagePlayer:
          this.playerHealth -= modValue;
          break;

        case TrialCardsEffect.HealPlayer:
          this.playerHealth += modValue;
          if (this.playerHealth > this.state.playerMaxHealth) {
            this.playerHealth = this.state.playerMaxHealth;
          }
          break;
      }
    },
    async attack() {
      this.request = await this.$game.attackTrial(this.trialType);

      const response = await this.request;

      const { attackResult, cards, fightFinished } = response;
      this.$refs.floatingText.addFloatingText(
        attackResult.damage,
        attackResult.crit
      );

      this.enemyHealth = attackResult.enemyHealth;
      this.playerHealth = attackResult.playerHealth;
      this.cards = cards;
    }
  }
};
</script>