<template>
  <div class="z-index-100 absolute-stretch" @close="$close" @click="$close">
    <ArmySummonResults :units="units"></ArmySummonResults>

    <portal to="footer" v-if="isActive">
      <div class="flex flex-center width-100 height-100">
        <span class="font-size-20 uppercase font-weight-900">{{
          $t("continue_from_gacha")
        }}</span>
      </div>
    </portal>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import ArmySummonResults from "@/views/Summon/Army/ArmySummonResults.vue";

export default {
  mixins: [HintHandler, ActivityMixin],
  components: {
    ArmySummonResults
  },
  props: ["units"]
};
</script>

<style lang="less" scoped></style>
