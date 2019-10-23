<template>
  <div class="flex flex-column flex-space-around flex-items-center card-modifier margin-1">
    <span class="font-size-20 rarity-legendary font-outline">{{$t(name)}}</span>

    <div class="flex flex-center font-size-18 font-outline">
      <span v-if="negative">-</span>
      <span>{{modifierValue()}}</span>
      <span v-if="relative">%</span>

      <span class="margin-left-half margin-right-half right-arrow"></span>

      <span class="rarity-rare">
        <span v-if="negative">-</span>
        <span>{{nextModiferValue()}}</span>
        <span v-if="relative">%</span>
      </span>
    </div>

    <CustomButton type="yellow" @click="$emit('upgrade')" :disabled="!enoughPoints">
      <div class="flex flex-center">
        <span class="item-icon trials-points-item margin-right-half"></span>
        <span>{{upgradeCost}}</span>
      </div>
    </CustomButton>
  </div>
</template>

<script>
import CardInfo from "./CardInfo.vue";
import CustomButton from "@/components/Button.vue";
import TrialsMeta from "@/trials_meta";
import TrailCardModifer from "@/../knightlands-shared/trial_card_modifiers";

export default {
  props: ["upgradeCost", "type"],
  mixins: [CardInfo],
  components: { CustomButton },
  computed: {
      enoughPoints() {
          return this.$game.getTrialsCard().points >= this.upgradeCost;
      },
    relative() {
      return (
        this.type == TrailCardModifer.DecreaseRelatively ||
        this.type == TrailCardModifer.IncreaseRelatively
      );
    },
    negative() {
      return this.type == TrailCardModifer.DecreaseRelatively;
    }
  }
};
</script>

<style lang="less" scoped>
.card-modifier {
  width: 18rem;
  height: 27rem;
  padding: 2rem;
  background-repeat: no-repeat;
  background-size: contain;
  backface-visibility: hidden;
  background-image: url("../../../assets/ui/card_front.png");
}
</style>