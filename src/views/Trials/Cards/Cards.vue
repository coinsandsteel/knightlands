<template>
  <div class="flex flex-space-evenly absolute-stretch">
    <CardModifier v-for="mod in cardModifiers" :key="mod.effect" :modifier="mod" />
  </div>
</template>

<script>
import TrialsMeta from "@/trials_meta";
import CardModifier from "./CardModifier.vue";

export default {
    name: "trial-cards",
  props: ["cardModifiers"],
  components: { CardModifier },
  data: () => ({
    upgradeCost: TrialsMeta.upgradeCost
  })
};
</script>