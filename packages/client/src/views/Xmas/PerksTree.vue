<template>
  <div class="flex flex-column flex-items-center flex-start">
    <div
      class="even-bg flex flex-center width-100 font-size-20 padding-top-1 padding-bottom-1 flex-no-wrap"
    >
      <span class="icon-lock-big" v-if="!unlocked"></span>
      {{ $t(name) }}
    </div>

    <CustomButton v-if="!unlocked" type="green" @click="$emit('unlock')"
      >Unlock</CustomButton
    >

    <template v-else>
      <div
        v-for="(levels, index) in perkLevels"
        :key="index"
        class="width-100 flex flex-center margin-bottom-2"
        :class="{ 'even-bg': (index + 1) % 2 == 0 }"
      >
        <PerkIcon
          class="margin-right-1 margin-left-1"
          :class="{ pointer: perks[p].enabled }"
          v-for="p in levels"
          :key="p"
          :perk="p"
          :level="perks[p].level"
          :locked="!perks[p].enabled"
          @click="handleClick(p)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import PerkIcon from "./PerkIcon.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["perks", "name", "unlocked", "perkLevels", "tier", "currency"],
  components: { PerkIcon, CustomButton },
  methods: {
    handleClick(perk) {
      this.$emit("upgrade", this.currency, this.tier, perk);
    }
  }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>
