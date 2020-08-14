<template>
  <div class="flex flex-space-between flex-items-end panel margin-1 padding-1">
    <div class="flex flex-column">
      <div class="flex font-size-25 margin-1 panel-dark padding-left-1 padding-right-1">
        <span class="margin-right-1">{{$t("current-rank")}}</span>
        <span>{{race.rank.rank}}</span>
      </div>

      <div class="flex flex-center">
        <Loot
          v-for="(r, index) in rewards"
          :key="index"
          :item="r.item"
          :quantity="r.quantity"
          @hint="handleHint"
        />
      </div>
    </div>

    <CustomButton type="yellow" @click="$emit('claim', race)">{{$t("claim-reward")}}</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  props: ["race"],
  mixins: [HintHandler],
  components: { CustomButton, Loot },
  computed: {
    rewards() {
      return this.race.rewards;
    }
  }
};
</script>