<template>
  <div ref="port" class="relative width-100 height-100" v-bar>
    <div id="map">
      <XmasTower @click="$emit('toggle-perks')" />
      <XmasFarm
        :key="'tier-' + tier"
        v-for="(slot, tier) in slots"
        :style="slot.style"
        :tier="tier"
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";

import Erorrs from "@/../../knightlands-shared/errors";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { create } from "vue-modal-dialogs";

import XmasTower from "./XmasTower.vue";
import XmasFarm from "./XmasFarm.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { abbreviateNumber } from "../../../../knightlands-shared/xmas";

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    XmasTower,
    XmasFarm,
    ProgressBar
  },
  watch: {},
  mounted() {
    this.$store.dispatch("xmas/setInitialState");
  },
  data: () => {
    return {
      slots: {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {}
      }
    };
  },
  methods: {},
  computed: {}
};
</script>

<style lang="less" scoped>
#map {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: start;
}
</style>
