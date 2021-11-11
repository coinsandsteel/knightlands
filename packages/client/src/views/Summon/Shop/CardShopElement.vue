<template>
  <div class="flex flex-column font-size-20">
    <Title :stackTop="true" :stackBottom="true">{{ $t(card.title) }}</Title>

    <div class="flex flex-column flex-center color-panel-1">
      <div
        v-if="card.initialHard"
        class="flex flex-center line"
        v-html="$t('sub-8', { c: card.initialHard })"
      ></div>

      <div
        v-if="card.initialHard"
        class="flex flex-center line"
        v-html="$t('sub-9', { c: card.dailyHard })"
      ></div>

      <div
        v-if="card.initialHard"
        class="flex flex-center line"
        v-html="$t('sub-10', { c: card.initialHard + card.dailyHard * 14 })"
      ></div>

      <div
        v-if="card.addDkt"
        class="flex flex-center line"
        v-html="$t('sub-7', { c: card.addDkt })"
      ></div>
      <div
        v-if="card.addExp"
        class="flex flex-center line"
        v-html="$t('sub-5', { c: card.addExp })"
      ></div>
      <div
        v-if="card.addGold"
        class="flex flex-center line"
        v-html="$t('sub-6', { c: card.addGold })"
      ></div>

      <span class="line" v-if="card.fastQuests">{{ $t("sub-11") }}</span>

      <span class="line" v-if="card.towerAttempts">{{
        $t("sub-1", { c: card.towerAttempts })
      }}</span>
      <span class="line" v-if="card.armourTrialAttempts">{{
        $t("sub-2", { c: card.armourTrialAttempts })
      }}</span>
      <span class="line" v-if="card.weaponTrialAttempts">{{
        $t("sub-3", { c: card.weaponTrialAttempts })
      }}</span>
      <span class="line" v-if="card.accessoryTrialAttempts">{{
        $t("sub-4", { c: card.accessoryTrialAttempts })
      }}</span>

      <span class="margin-top-2 font-size-25 font-weight-900">{{
        $t("sub-d", { d: Math.floor((card.duration * 100) / 86400) / 100 })
      }}</span>

      <div class="color-panel-5 margin-top-1" v-if="isActivated">
        <span class="font-size-18 rarity-rare margin-top-1 font-outline">{{
          $t("sub-a", { timer: timer.value })
        }}</span>
      </div>

      <CustomButton
        type="yellow"
        @click="$emit('purchase')"
        class="margin-top-2"
        v-if="card.iap"
      >
        {{ isActivated ? $t("sub-c") : $t("sub-p") }}
        <PriceTag :dark="true" :iap="card.iap"></PriceTag>
      </CustomButton>
    </div>
  </div>
</template>

<script>
import PriceTag from "@/components/PriceTag.vue";
import Title from "@/components/Title.vue";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";
import { formatDuration } from "@/format";

export default {
  components: { CustomButton, PriceTag, Title },
  props: ["card", "index"],
  data: () => ({
    timer: new Timer(true)
  }),
  watch: {
    "$game.subscriptions.cards": {
      deep: true,
      handler() {
        this.updateTimer();
      }
    }
  },
  mounted() {
    this.updateTimer();
  },
  computed: {
    duration() {
      return formatDuration(this.card.duration);
    },
    subscription() {
      return this.$game.subscriptions.cards[this.card.id];
    },
    isActivated() {
      if (!this.subscription) {
        return false;
      }

      return this.subscription.end >= this.$game.nowSec;
    }
  },
  methods: {
    updateTimer() {
      if (this.subscription) {
        this.timer.timeLeft = this.subscription.end - this.$game.nowSec;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.line {
  margin-top: 1rem;
}
</style>
