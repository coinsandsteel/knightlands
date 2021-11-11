<template>
  <div class="flex flex-column t-floor" :style="style">
    <Title :stackTop="true" class="font-size-22">{{
      $t("tower-floor-title", { floor: floor._id + 1 })
    }}</Title>

    <div class="flex flex-full flex-space-between">
      <div class="flex flex-column flex-items-start padding-left-3">
        <span class="font-size-20 margin-bottom-half">{{
          $t(firstTime || locked ? "tower-rewards" : "tower-rewards-2")
        }}</span>
        <div class="flex flex-space-evenly">
          <IconWithValue
            valueClass="font-size-20 margin-right-3"
            iconClass="icon-gold"
            >{{ floor.softCurrency }}</IconWithValue
          >
          <IconWithValue valueClass="font-size-20" iconClass="icon-exp">{{
            floor.exp
          }}</IconWithValue>
        </div>
        <div class="flex margin-top-half">
          <Loot
            v-for="reward in rewards"
            :key="`${reward.itemId}${floor._id}`"
            :item="reward.itemId"
            :quantity="reward.maxCount"
            size="small"
            @hint="handleHint"
          ></Loot>
        </div>
      </div>

      <div class="flex flex-column padding-right-2 flex-items-center">
        <div class="flex font-size-20 margin-bottom-half">
          <IconWithValue iconClass="icon-health">
            {{ floor.health }}
          </IconWithValue>
        </div>
        <div class="flex font-size-20 margin-bottom-1">
          <IconWithValue iconClass="icon-attack">
            {{ floor.attack }}
          </IconWithValue>
        </div>
        <div class="flex">
          <CustomButton
            :disabled="locked"
            class="btn"
            type="yellow"
            minWidth="20rem"
            @click="$emit('challenge', floor._id)"
            >{{ $t("tower-challenge") }}</CustomButton
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

export default {
  props: ["floor", "locked", "firstTime", "height", "index"],
  components: { CustomButton, IconWithValue, Loot, Title },
  computed: {
    rewards() {
      if (this.firstTime || this.locked) {
        return this.floor.firstClearReward.guaranteedRecords;
      }

      return this.floor.repeatClearReward.records;
    },
    style() {
      return { height: this.height + "px" };
    }
  },
  methods: {
    handleHint(item) {
      this.$emit("hint", item);
    }
  }
};
</script>
