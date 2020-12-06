<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div
      class="flex flex-center padding-top-1"
      v-for="(payout, bId) in pools"
      :key="bId"
    >
      <IconWithValue
        :iconClass="getIcon(bId)"
        valueClass="font-size-30 font-weight-900"
        :flip="true"
        >{{ toDecimal(bId, payout) }}</IconWithValue
      >
    </div>
  </div>
</template>

<script>
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  mixins: [BlockchainUtilsMixin],
  props: ["pools"],
  components: { IconWithValue }
};
</script>
