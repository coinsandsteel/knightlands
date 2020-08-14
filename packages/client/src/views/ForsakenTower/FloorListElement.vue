<template>
  <div class="flex flex-column panel padding-top-1 padding-bottom-1 margin-left-1 margin-right-1">
    <span
      class="font-size-22 flex-self-start margin-left-3 margin-bottom-1"
    >{{$t("tower-floor-title", {floor: floor._id + 1})}}</span>

    <div class="flex flex-full flex-space-between">
      <div class="flex flex-column flex-items-start padding-left-3">
        <span class="font-size-18 margin-bottom-half">{{$t(firstTime||locked?"tower-rewards":"tower-rewards-2")}}</span>
        <div class="flex flex-space-evenly">
          <IconWithValue
            valueClass="font-size-18 margin-right-3"
            iconClass="icon-gold"
          >{{floor.softCurrency}}</IconWithValue>
          <IconWithValue valueClass="font-size-18" iconClass="icon-exp">{{floor.exp}}</IconWithValue>
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

      <div class="flex flex-column padding-right-2">
        <div class="flex font-size-18 margin-bottom-half">
          <span class="margin-right-1">{{$t("health")}}</span>
          <span>{{floor.health}}</span>
        </div>
        <div class="flex font-size-18 margin-bottom-1">
          <span class="margin-right-1">{{$t("attack")}}</span>
          <span>{{floor.attack}}</span>
        </div>
        <div class="flex">
          <CustomButton
            :disabled="locked"
            type="yellow"
            @click="$emit('challenge', floor._id)"
          >{{$t("tower-challenge")}}</CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Loot from "@/components/Loot.vue";

export default {
  props: ["floor", "locked", "firstTime"],
  components: { CustomButton, IconWithValue, Loot },
  computed: {
    rewards() {
      if (this.firstTime || this.locked) {
        return this.floor.firstClearReward.guaranteedRecords;
      }

      return this.floor.repeatClearReward.records;
    }
  },
  methods: {
    handleHint(item) {
      this.$emit("hint", item);
    }
  }
};
</script>