<template>
  <div class="width-100 flex flex-center input-bg text-align-center">
    <span
      class="input align-text flex-11 font-size-30 text-align-left font-white"
      @click="tokensOverlay = true"
      :class="{ 'grey-title': selectedToken == '' }"
    >
      {{ selectedToken == "" ? $t("empty-network") : $t(`t-${selectedToken}`) }}
    </span>
    <span class="nav-arrow margin-right-2"></span>

    <div
      class="overlay absolute-stretch flex flex-column flex-end"
      @click.self="tokensOverlay = false"
      v-show="tokensOverlay"
    >
      <div class="flex flex-column color-panel-2 font-size-22">
        <div
          class="margin-top-half margin-bottom-half net-elem padding-2 no-select"
          v-for="c in tokens"
          :key="c"
          @click="preselectedToken = c"
          :class="{ selectedNetwork: preselectedToken == c }"
        >
          <IconWithValue :iconClass="icon(c)">{{ $t(`t-${c}`) }}</IconWithValue>
        </div>
        <CustomButton
          class="margin-top-2"
          type="yellow"
          @click="confirm"
          :disabled="preselectedToken == ''"
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
import CurrencyType from "@/../../knightlands-shared/currency_type";

export default {
  components: { CustomButton, IconWithValue },
  data: () => ({
    tokensOverlay: false,
    tokens: [CurrencyType.Dkt, CurrencyType.Dkt2],
    selectedToken: "",
    preselectedToken: ""
  }),
  methods: {
    icon(chain) {
      switch (chain) {
        case Blockchains.Tron:
          return "icon-trx";
      }

      return "";
    },
    confirm() {
      this.selectedToken = this.preselectedToken;
      this.$emit("input", this.preselectedToken);
      this.tokensOverlay = false;
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
