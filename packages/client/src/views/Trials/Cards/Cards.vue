<template>
  <PromisedView :promise="request" class="height-100">
    <template v-slot:fixed>
      <div v-bar class="height-100">
        <div>
          <div class="flex flex-space-evenly height-100">
            <CardModifier
              v-for="mod in cardModifiers"
              :key="getModKey(mod)"
              :effect="mod.effect"
              :type="mod.type"
              :upgradeCost="getUpgradeCost(mod.effect)"
              @upgrade="upgradeCard(mod.effect)"
            />
          </div>
        </div>
      </div>

      <portal to="footer" :slim="true" v-if="isActive">
        <div class="flex flex-center margin-1 font-size-20">
          <span class="item-icon ticket_blue margin-right-half"></span>
          <span>{{ points }}</span>
        </div>

        <CustomButton :disabled="!needReset" type="yellow" @click="resetCards">
          {{ $t("trials-cards-reset") }}
          <IconWithValue iconClass="icon-gold">{{ resetCost }}</IconWithValue>
        </CustomButton>
      </portal>
    </template>
  </PromisedView>
</template>

<script>
import TrialsMeta from "@/trials_meta";
import CardModifier from "./CardModifier.vue";
import PromisedView from "@/components/PromisedView.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";

export default {
  name: "trial-cards",
  mixins: [ActivityMixin],
  components: {
    CardModifier,
    CustomButton,
    PromisedView,
    IconWithValue
  },
  data: () => ({
    cardModifiers: TrialsMeta.cardModifiers,
    modifiersLevels: {},
    request: null
  }),
  mounted() {
    this.modifiersLevels = this.$game.getTrialsCard().modifiers;
  },
  computed: {
    resetCost() {
      return this.$game.trialCardsResolver.getResetPrice(
        this.totalPoints - this.points
      );
    },
    points() {
      return this.$game.getTrialsCard().points;
    },
    totalPoints() {
      return this.$game.getTrialsCard().totalPoints;
    },
    needReset() {
      return this.points != this.totalPoints;
    }
  },
  methods: {
    getModKey(modifier) {
      return `${modifier.effect}_${this.modifiersLevels[modifier.effect]}`;
    },
    async resetCards() {
      this.request = this.$game.resetTrialsCards();
    },
    async upgradeCard(cardEffect) {
      this.request = this.$game.upgradeTrialsCard(cardEffect);
    },
    getUpgradeCost(cardEffect) {
      let nextLevel = (this.modifiersLevels[cardEffect] || 0) + 1;
      if (TrialsMeta.upgradeCost.length <= nextLevel) {
        nextLevel = TrialsMeta.upgradeCost.length - 1;
      }

      return TrialsMeta.upgradeCost[nextLevel];
    }
  }
};
</script>
