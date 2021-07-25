<template>
  <div class="width-100 flex flex-center input-bg text-align-center">
    <span
      class="input align-text flex-11 font-size-30 text-align-left font-white"
      @click="showNetworks"
      :class="{ 'grey-title': selectedNetwork == '' }"
    >
      {{ selectedNetwork == "" ? $t("empty-network") : $t(selectedNetwork) }}
    </span>
    <span v-show="!lockTo" class="nav-arrow margin-right-2"></span>

    <div
      class="overlay absolute-stretch flex flex-column flex-end"
      @click.self="networksOverlay = false"
      v-show="networksOverlay"
    >
      <div class="flex flex-column color-panel-2 font-size-22">
        <div
          class="margin-top-half margin-bottom-half net-elem padding-2"
          v-for="c in availableChains"
          :key="c"
          @click="selectedNetwork = c"
          :class="{ selectedNetwork: selectedNetwork == c }"
        >
          <IconWithValue :iconClass="icon(c)">{{ $t(c) }}</IconWithValue>
        </div>
        <CustomButton
          class="margin-top-2"
          type="yellow"
          @click="confirmNetwork"
          :disabled="selectedNetwork == ''"
          >{{ $t("btn-confirm") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Blockchains from "@/../../knightlands-shared/blockchains";

export default {
  components: { CustomButton, IconWithValue },
  props: ["lockTo"],
  data: () => ({
    networksOverlay: false,
    availableChains: [Blockchains.Ethereum, Blockchains.Polygon],
    selectedNetwork: ""
  }),
  watch: {
    lockTo: {
      immediate: true,
      handler() {
        this.selectedNetwork = this.lockTo;
      }
    }
  },
  methods: {
    showNetworks() {
      if (this.lockTo) {
        return;
      }
      this.networksOverlay = true;
    },
    icon(chain) {
      switch (chain) {
        case Blockchains.Tron:
          return "icon-trx";
      }

      return "";
    },
    confirmNetwork() {
      this.$emit("confirm", this.selectedNetwork);
      this.networksOverlay = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";

.align-text {
  line-height: 4rem;
}

.overlay {
  z-index: 5;
  background-color: #2100285b;
}

.net-elem {
  background-color: #193f5f;
  border-top: solid 1px transparent;
  border-bottom: solid 1px transparent;
  transition: all 0.2s ease;
}

.selectedNetwork {
  border-top: solid 1px yellow;
  border-bottom: solid 1px yellow;
}
</style>
