<template>
  <div class="flex flex-column flex-center">
    <div
      class="even-bg flex flex-center width-100 font-size-20 padding-top-1 padding-bottom-1 flex-no-wrap"
    >
      <span class="icon-lock-big"></span>
      {{ $t(name) }}
    </div>

    <CustomButton v-if="!unlocked" type="green" @click="$emit('unlock')"
      >Unlock</CustomButton
    >

    <template v-else>
      <div
        v-for="(p, id, index) in perks"
        :key="id"
        class="width-100 flex flex-center margin-bottom-1"
        :class="{ 'even-bg': index % 2 == 0 }"
      >
        <PerkIcon :perk="id" :level="p.level" />
      </div>
    </template>
  </div>
</template>

<script>
import PerkIcon from "./PerkIcon.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["perks", "name", "unlocked"],
  components: { PerkIcon, CustomButton }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>
