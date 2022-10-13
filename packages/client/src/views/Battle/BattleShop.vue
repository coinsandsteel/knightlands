<template>
  <div class="screen-content">
    <div class="full-flex width-100" v-bar>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="option-name font-size-25 text-align-center padding-1">
          Choose a pack:
        </div>

        <div class="flex flex-center">
          <div class="flex flex-center flex-column width-100">
            <BattleChestElement
              v-for="(chest, index) in chests"
              :key="chest.name"
              :chest="chest"
              :index="index"
            />
          </div>
        </div>

        <div
          class="battle-shop-balance flex flex-center flex-column margin-top-2"
        >
          <div class="font-size-22 flex flex-center margin-bottom-1">
            FLESH balance:
            <IconWithValue iconClass="icon-dkt" class="margin-left-1">{{
              balance.flesh
            }}</IconWithValue>
          </div>
          <!-- <div class="font-size-22 margin-bottom-1 flex flex-center">
            Shinies balance:
            <IconWithValue iconClass="icon-premium" class="margin-left-1">{{
              balance.hard
            }}</IconWithValue>
          </div> -->
          <div class="font-size-22 margin-bottom-3 flex flex-center">
            Ancient coins balance:
            <BattleCoin :hasMargin="true" class="margin-left-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as battle from "@/../../knightlands-shared/battle";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleChestElement from "@/views/Battle/BattleChestElement.vue";

export default {
  components: {
    BattleCoin,
    BattleChestElement
    // BackButton
  },
  mixins: [AppSection, ActivityMixin, NetworkRequestErrorMixin, PromptMixin],
  data() {
    return {
      chests: battle.SHOP,
      shopIndex: null
    };
  },
  computed: {
    balance() {
      return {
        hard: this.$game.hardCurrency,
        flesh: this.$game.dkt
      };
    }
  },
  filters: {
    shinesPrice(value) {
      return Math.round(value);
    },
    fleshPrice(value) {
      return +(Math.round(value * 100) / 100).toFixed(2);
    }
  },
  activated() {
    this.title = this.$t("Shop");
  },
  methods: {
    backHandler() {
      this.$router.push({ name: "battle-play" });
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.option-name {
  background: rgba(0, 0, 0, 0.5);
}
.battle-shop-balance::v-deep {
  .icon-dkt,
  .icon-premium {
    margin-right: 3px;
  }
}
</style>
