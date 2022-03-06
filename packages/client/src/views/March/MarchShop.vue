<template>
  <div class="screen-content">
    <div class="full-flex width-100" v-bar>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="option-name font-size-25 text-align-center padding-1">
          Choose pack:
        </div>

        <div
          class="option-items width-100 flex flex-center flex-space-evenly padding-1"
        >
          <div
            class="flex flex-column flex-center margin-1 padding-1"
            v-for="(shopItem, shopIndex) in options"
            :key="'option-' + shopIndex"
          >
            <div>
              <MarchGold
                class="march-gold--with-background margin-bottom-1"
                :value="shopItem.quantity"
              />

              <CustomButton
                :disabled="balance.hard < shopItem.hardPrice"
                type="grey"
                @click="purchase(shopIndex, 'hard', shopItem.quantity)"
                :class="'margin-bottom-1'"
              >
                <div class="flex flex-center">
                  <IconWithValue iconClass="icon-premium">
                    <div class="inline-block margin-left-half">
                      {{ shopItem.hardPrice | shinesPrice }}
                    </div>
                  </IconWithValue>
                </div>
              </CustomButton>

              <CustomButton
                :disabled="balance.flesh < shopItem.fleshPrice"
                type="grey"
                @click="purchase(shopIndex, 'dkt', shopItem.quantity)"
              >
                <div class="flex flex-center">
                  <IconWithValue iconClass="icon-dkt">
                    <div class="inline-block margin-left-half">
                      {{ shopItem.fleshPrice | fleshPrice }}
                    </div>
                  </IconWithValue>
                </div>
              </CustomButton>
            </div>
          </div>
        </div>

        <div class="flex flex-center flex-column">
          <div class="font-size-22 flex flex-center margin-bottom-1">
            FLESH balance:
            <IconWithValue iconClass="icon-dkt" class="margin-left-1">{{
              balance.flesh
            }}</IconWithValue>
          </div>
          <div class="font-size-22 margin-bottom-3 flex flex-center">
            Shinies balance:
            <IconWithValue iconClass="icon-premium" class="margin-left-1">{{
              balance.hard
            }}</IconWithValue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import * as march from "@/../../knightlands-shared/march";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";
import MarchGold from "@/views/March/MarchGold.vue";

export default {
  components: {
    MarchGold
  },
  mixins: [ActivityMixin, NetworkRequestErrorMixin, PromptMixin],
  data() {
    return {
      options: march.SHOP,
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
  methods: {
    async purchase(shopIndex, currency, amount) {
      const response = await this.showPrompt(
        this.$t("buy-i-t"),
        this.$t("buy-i-q"),
        [
          {
            type: "red",
            title: this.$t("buy-i-n"),
            response: false
          },
          {
            type: "green",
            title: this.$t("buy-i-y"),
            response: true
          }
        ]
      );

      if (!response) {
        return;
      }

      await this.performRequestNoCatch(
        this.$store.dispatch("march/purchaseGold", {
          shopIndex,
          currency,
          amount
        })
      );

      const ShowDialog = create(ItemsReceived, "items", "marchGold");
      ShowDialog([], this.options[shopIndex].quantity);
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
</style>
