<template>
  <div class="flex flex-column">
    <Title
      :stackTop="true"
      :stackBottom="true"
      class="font-size-22 flex flex-center"
    >
      <span>{{ $t("trial-stage-title", { stage: index + 1 }) }}</span>
      <span v-if="isElemental" :class="`icon-${element}`"></span>
    </Title>

    <div class="flex flex-full flex-space-between color-panel-2">
      <div class="flex flex-column flex-items-start padding-left-3 flex-8">
        <span class="font-size-18 margin-bottom-half">{{
          $t(firstTime ? "tower-rewards" : "tower-rewards-2")
        }}</span>
        <div class="flex flex-space-evenly">
          <IconWithValue
            valueClass="font-size-18 margin-right-3"
            iconClass="icon-gold"
            >{{ soft }}</IconWithValue
          >
          <IconWithValue valueClass="font-size-18" iconClass="icon-exp">{{
            exp
          }}</IconWithValue>
        </div>
        <div class="flex margin-top-half">
          <Loot
            v-for="reward in rewards()"
            :key="`${reward.itemId}_${reward.maxCount}`"
            :item="reward.itemId"
            :quantity="reward.maxCount"
            size="small"
            @hint="handleHint"
          ></Loot>
        </div>
      </div>

      <div class="flex flex-column flex-items-center flex-space-between flex-4">
        <span v-if="locked" class="rarity-mythical font-size-18">{{
          $t(inFight ? "trial-stage-locked-2" : "trial-stage-locked")
        }}</span>

        <div
          class="flex font-size-18 margin-bottom-1"
          v-else-if="!readyToCollect"
        >
          <span>{{ $t("trial-stage-progress") }}</span>
          <span class="margin-left-1"
            >{{ fightsComplete }}/{{ totalFights }}</span
          >
        </div>
        <div class="flex">
          <CustomButton
            v-if="readyToCollect"
            :disabled="inFight"
            type="green"
            @click="$emit('collect', index)"
            >{{ $t("trial-stage-collect") }}</CustomButton
          >

          <CustomButton
            v-else
            :disabled="locked"
            type="yellow"
            @click="$emit('continue', index)"
            >{{ $t("continue") }}</CustomButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Loot from "@/components/Loot.vue";
import Title from "@/components/Title.vue";
import Elements from "@/../../knightlands-shared/elements";

export default {
  props: ["index", "stage", "state", "locked", "inFight", "element"],
  components: { CustomButton, IconWithValue, Loot, Title },
  computed: {
    readyToCollect() {
      return this.cleared && !this.collected;
    },
    fightsComplete() {
      return this.state ? Object.keys(this.state.finishedFights).length : 0;
    },
    totalFights() {
      return this.stage.fights.length;
    },
    cleared() {
      if (!this.state) {
        return false;
      }
      return this.state.cleared;
    },
    collected() {
      if (!this.state) {
        return true;
      }
      return this.state.collected;
    },
    soft() {
      if (!this.state || !this.state.firstTimeCleared) {
        return this.stage.firstClearanceReward.soft;
      }

      return this.stage.repeatedReward.soft;
    },
    exp() {
      if (!this.state || !this.state.firstTimeCleared) {
        return this.stage.firstClearanceReward.exp;
      }

      return this.stage.repeatedReward.exp;
    },
    isElemental() {
      return this.element != Elements.Physical;
    },
    firstTime() {
      return !this.state || !this.state.firstTimeCleared;
    }
  },
  methods: {
    handleHint(item) {
      this.$emit("hint", item);
    },
    rewards() {
      if (this.firstTime) {
        return this.stage.firstClearanceReward.loot.guaranteedLootRecords;
      }

      return this.stage.repeatedReward.loot.lootRecords;
    }
  }
};
</script>
