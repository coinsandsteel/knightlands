<template>
  <div class="flex flex-column flex-center">
    <PerkIcon v-for="(p, id) in perks" :key="id" :perk="id" :level="p.level" />
  </div>
</template>

<script>
import { perksTree } from "@/../../knightlands-shared/xmas";

import PerkIcon from "./PerkIcon.vue";

export default {
  props: ["perks"],
  components: { PerkIcon },
  computed: {
    // perks() {
    //   if (!this.currency) {
    //     return {};
    //   }
    //   console.log(this.currency);
    //   return perksTree[this.currency].tiers.all;
    // }
  }
};
</script>
