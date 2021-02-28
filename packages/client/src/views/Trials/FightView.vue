<template>
  <div class="relative flex flex-column flex-center flex-no-wrap">
    <EnemyView
      ref="enemyView"
      :image="enemyImage"
      :background="`${background}`"
    >
      <FloatingTextContainer
        ref="floatingText"
        :enemyView="$refs.enemyView"
        class="absolute-stretch"
      ></FloatingTextContainer>
    </EnemyView>

    <ProgressBar
      valuePosition="top"
      class="margin-top-1 margin-bottom-2"
      valueClass="white-font font-outline font-size-25"
      :thresholds="barThreshold"
      v-model="enemyHealth"
      :maxValue="state.maxHealth"
      height="1rem"
    ></ProgressBar>

    <div class="color-panel-2 flex flex-column width-100 padding-1">
      <span class="margin-top-1 margin-bottom-1 font-size-22">{{
        $t("tower-player-hp")
      }}</span>
      <ProgressBar v-model="playerHealth" :maxValue="maxHealth"></ProgressBar>

      <HintButton
        class="margin-top-1 margin-bottom-1 font-size-22"
        title="tr-f-1"
        :texts="['tr-f-2', 'tr-f-3', 'tr-f-4']"
      >
        {{ $t("trial-player-mana") }}
      </HintButton>
      <ProgressBar
        barType="blue"
        :value="mana"
        :maxValue="maxMana"
      ></ProgressBar>

      <!-- <div v-if="lost" class="flex margin-top-2 width-100 flex-center">
        <PromisedButton
          :promise="request"
          @click="close(true)"
          :props="{width: '15rem', type:'red'}"
        >{{$t("continue")}}</PromisedButton>
      </div>-->

      <div class="flex margin-top-2 flex-center width-100 flex-space-evenly">
        <AttackButton :promise="request" @click="attack" type="red">{{
          $t("btn-attack")
        }}</AttackButton>

        <PromisedButton
          :promise="request"
          :disabled="!enoughManaToSummon"
          @click="summonCards"
          type="blue"
          >{{ $t("btn-summon-trial-cards") }}</PromisedButton
        >

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
import AttackButton from "@/components/AttackButton.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import UiConstants from "@/ui_constants";
import CardSelector from "./Cards/CardSelector.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import TrialCardsEffect from "@/../../knightlands-shared/trial_cards_effect";
import Errors from "@/../../knightlands-shared/errors";
import TrialsMeta from "@/trials_meta";
import HintButton from "@/components/HintButton.vue";

import PurchaseAttempts from "./PurchaseAttempts.vue";
import { create } from "vue-modal-dialogs";

const ShowPurchaseAttempts = create(PurchaseAttempts);

export default {
  props: ["state", "meta", "trialIndex", "trialType", "trialMeta"],
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    EnemyView,
    FloatingTextContainer,
    PromisedButton,
    ProgressBar,
    CardSelector,
    AttackButton,
    HintButton
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
    mana() {
      return this.$game.getTrialsCard().mana;
    },
    maxMana() {
      return TrialsMeta.maxMana;
    },
    maxHealth() {
      return this.state.maxPlayerHealth;
    },
    fightMeta() {
      return this.trialMeta.stages.find(s => s.id == this.state.stageId).fights[
        this.state.index
      ];
    },
    enoughManaToSummon() {
      return this.mana >= TrialsMeta.cardSummonCost;
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
    async summonCards() {
      this.request = this.performRequest(
        this.$game.summonTrialCards(this.trialType)
      );
      this.cards = await this.request;
    },
    async fetchRemoteData() {
      this.request = this.performRequest(
        this.$game.fetchTrialFightMeta(
          this.trialType,
          this.trialMeta.id,
          this.state.stageId,
          this.state.index
        )
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
          if (this.playerHealth > this.maxHealth) {
            this.playerHealth = this.maxHealth;
          }
          break;
      }
    },
    async attack() {
      this.request = this.performRequestNoCatch(
        this.$game.attackTrial(this.trialType)
      );

      try {
        const { attackResult } = await this.request;
        this.$refs.floatingText.addFloatingText(
          attackResult.damage,
          attackResult.crit
        );

        this.enemyHealth = attackResult.enemyHealth;
        this.playerHealth = attackResult.playerHealth;
      } catch (exc) {
        if (exc.includes(Errors.TrialNoAttempts)) {
          const response = await this.showPrompt(
            "prompt-snap-title",
            "trials-no-keys",
            [
              { type: "grey", title: "Ok", response: 1 },
              { type: "green", title: "btn-p-more", response: 2 }
            ]
          );

          if (response === 2) {
            await ShowPurchaseAttempts({
              trialType: this.trialType
            });
          }
        }
      }
    }
  }
};
</script>
