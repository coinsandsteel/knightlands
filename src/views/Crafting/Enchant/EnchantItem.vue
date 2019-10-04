<template>
  <div class="padding-1 flex flex-column flex-justify-center dummy-height">
    <Promised :promise="request">
      <template v-slot:combined="{ isPending, isDelayOver, data }">
        <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

        <StripedPanel class="dummy-height flex flex-center flex-column" v-if="item">
          <ItemInfo :item="item" :onlyStats="true" :lootProps="{onlyIcon:true}">
            <template v-slot:beforeStats>
              <div ref="level">
                <div class="flex flex-center margin-top-1 font-size-20">
                  <span
                    class="flex flex-center flex-start margin-bottom-half"
                    v-if="canEnchant"
                    
                  >
                    <span class="yellow-title margin-right-half">{{$t("enchanting-level")}}</span>
                    {{item.enchant || 0}}
                    <span
                      class="margin-left-half margin-right-half right-arrow"
                    ></span>
                    <span class="green-title">{{(item.enchant || 0) + 1}}</span>
                  </span>
                  <span class="rarity-mythical" v-else>{{$t("enchanting-maxed-out")}}</span>
                </div>
              </div>
            </template>

            <template v-slot:stats v-if="canEnchant">
              <div
                class="margin-bottom-2 margin-top-1 flex flex-center font-size-20 flex-space-evenly"
              >
                <div class="flex width-40 flex-column flex-item-end text-align-right">
                  <div
                    v-for="(statValue, statId) in stats"
                    :key="statId"
                    class="margin-bottom-half width-100"
                  >{{$t(statId)}}</div>
                </div>
                <div class="flex width-40 flex-column text-align-left">
                  <div
                    v-for="(statValue, statId) in stats"
                    :key="statId"
                    class="margin-bottom-half flex flex-center flex-start width-100"
                  >
                    {{statValue}}
                    <span class="margin-left-half margin-right-half right-arrow"></span>
                    {{futureStats[statId]}}
                  </div>
                </div>
              </div>
            </template>
          </ItemInfo>

          <template v-if="canEnchant">
            <span
              class="margin-top-1 margin-bottom-1 title font-size-20"
            >{{$t("enchant-materials")}}</span>

            <StripedContent
              classes="margin-top-2 margin-bottom-2"
              contentClasses="width-100 flex flex-space-evenly"
              stripeHeight="10rem"
            >
              <crafting-ingridient
                v-for="(ingridient) in ingridients"
                :key="ingridient.itemId"
                :ingridient="ingridient"
                :hintHandler="showHint"
              />
            </StripedContent>

            <template v-if="!paymentInProcess">
              <transition name="fade">
                <span
                  class="margin-top-1 margin-bottom-1 rarity-mythical font-outline font-size-20"
                  v-if="failed"
                >{{$t("enchant-failed")}}</span>
              </transition>
              <transition name="fade">
                <span
                  class="margin-top-1 margin-bottom-1 orange-title font-outline font-size-20"
                  v-if="!failed"
                >{{$t("enchant-success-rate", {rate: stepData.successRate})}}</span>
              </transition>
            </template>

            <div class="flex flex-center width-100" v-if="!paymentInProcess">
              <CustomButton type="yellow" @click="enchant(currencies.Soft)" :disabled="!(enoughResources && enoughSoft)">
                {{$t("btn-enchant")}}
                <IconWithValue iconClass="icon-gold">{{stepData.soft}}</IconWithValue>
              </CustomButton>
            </div>

            <StripedContent
              classes="margin-top-3 margin-bottom-5"
              contentClasses="width-100 flex flex-space-evenly"
              stripeHeight="13rem"
              color="#2c5c40"
              v-if="stepData.successRate < 100"
            >
              <PaymentStatus
                ref="paymentStatus"
                :request="fetchPayment"
                @pay="continuePurchase"
                class="width-100"
              >
                <div class="flex flex-column width-100">
                  <span
                    class="margin-top-1 margin-bottom-1 rarity-rare font-outline font-size-20"
                  >{{$t("enchant-success-rate", {rate: 100})}}</span>

                  <div class="flex flex-center width-100 flex-space-evenly">
                    <CustomButton type="green" @click="enchant(currencies.Fiat)" :disabled="!enoughResources">
                      {{$t("btn-enchant")}}
                      <PriceTag :dark="true" :iap="stepData.iap"></PriceTag>
                    </CustomButton>

                    <CustomButton type="grey" @click="enchant(currencies.Hard)" :disabled="!(enoughResources && enoughHard)">
                      {{$t("btn-enchant")}}
                      <IconWithValue iconClass="icon-premium">{{stepData.hard}}</IconWithValue>
                    </CustomButton>
                  </div>
                </div>
              </PaymentStatus>
            </StripedContent>
          </template>
        </StripedPanel>
      </template>
    </Promised>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import anime from "animejs/lib/anime.es.js";
import ItemInfo from "@/components/ItemInfo.vue";
import LootContainer from "@/components/LootContainer.vue";
import CustomButton from "@/components/Button.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import Loot from "@/components/Loot.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import HintHandler from "@/components/HintHandler.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import PriceTag from "@/components/PriceTag.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CurrencyType from "@/../knightlands-shared/currency_type";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
const EnchantingMeta = require("@/enchanting_meta.json");
const Events = require("@/../knightlands-shared/events");

export default {
  mixins: [AppSection, PromptMixin, HintHandler, PaymentHandler],
  props: ["itemId"],
  components: {
    ItemInfo,
    LootContainer,
    CustomButton,
    Loot,
    StripedPanel,
    StripedContent,
    CraftingIngridient,
    IconWithValue,
    PriceTag,
    Promised,
    LoadingScreen,
    PaymentStatus
  },
  created() {
    this.title = "window-enchant-item";
    this.$options.useRouterBack = true;
    this.$options.paymentEvents = [Events.ItemEnchanted];
  },
  activated() {
    this.prepareItemForEnchant();
    this.fetchPaymentStatus();
    this.updateEnchantItemsList();
  },
  deactivated() {},
  data: () => ({
    item: null,
    ingridients: [],
    request: null,
    currencies: CurrencyType,
    fetchPayment: null,
    failed: false,
    paymentInProcess: false
  }),
  watch: {
    itemId() {
      this.prepareItemForEnchant();
      this.fetchPaymentStatus();
      this.updateEnchantItemsList();
    }
  },
  computed: {
    canEnchant() {
      return (
        this.currentEnchantingLevel < this.$game.itemsDB.getMaxEnchantingLevel()
      );
    },
    enoughSoft() {
      return this.stepData.soft <= this.$game.softCurrency;
    },
    enoughHard() {
      return this.stepData.soft <= this.$game.hardCurrency;
    },
    enoughResources() {
      return this.$game.crafting.hasEnoughIngridients(this.ingridients);
    },
    currentEnchantingLevel() {
      if (!this.item) return 0;
      return this.item.enchant || 0;
    },
    stepData() {
      if (this.item) {
        let template = this.$game.itemsDB.getTemplate(this.item.template);
        return EnchantingMeta.steps[template.rarity].steps[
          this.currentEnchantingLevel
        ];
      }

      return null;
    },
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    },
    futureStats() {
      return this.$game.itemsDB.getStats(
        this.item,
        null,
        this.currentEnchantingLevel + 1
      );
    }
  },
  methods: {
    async fetchPaymentStatus() {
      this.paymentInProcess = false;
      this.fetchPayment = this.$game.fetchEnchantingStatus(this.itemId);
      await this.fetchPayment;
      this.$nextTick(() => {
        if (!this.$refs.paymentStatus) {
          this.paymentInProcess = false;
        } else {
          this.paymentInProcess =
            this.$refs.paymentStatus.pending ||
            this.$refs.paymentStatus.waitingForPayment;
        }
      });
    },
    async enchant(currency) {
      let itemName = this.$t(this.$game.itemsDB.getName(this.item.template));
      let itemRarity = this.$game.itemsDB.getRarity(this.item.template);

      let confirmation = await this.showPrompt(
        this.$t("enchanting-confirm-title"),
        this.$t("enchanting-confirm-text", {
          item: itemName,
          rarity: itemRarity
        }),
        [
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          },
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: "ok"
          }
        ]
      );

      if (confirmation == "ok") {
        this.request = this.$game.enchantItem(this.itemId, currency);

        if (currency == CurrencyType.Fiat) {
          this.request = this.purchaseRequest(this.request);
        }

        let newItemId = await this.request;
        if (newItemId === false) {
          // failed
          this.failed = true;
          clearTimeout(this.failedTimeout);
          this.failedTimeout = setTimeout(() => (this.failed = false), 3000);

          let timeline = anime({
            targets: this.$refs.level,
            translateX: [
                { value: "-0.5rem" },
                { value: "0.45rem" },
                { value: "-0.4rem" },
                { value: "0.35rem" },
                { value: "-0.3rem" },
                { value: "0.25rem" },
                { value: "-0.2rem" },
                { value: "0rem" }

            ],
            easing: 'easeOutExpo',
            duration: 325,
            loop: 1
          });
        } else if (newItemId && newItemId != this.itemId) {
          this.$router.replace({
            name: "enchant-item",
            params: { itemId: newItemId }
          });
        }

        this.updateEnchantItemsList();
      }
    },
    updateEnchantItemsList() {
      this.ingridients.length = 0;

      if (this.item && this.stepData) {
        let i = 0;
        let ingridients = this.stepData.ingridients;
        const length = ingridients.length;

        for (; i < length; ++i) {
          let ingridient = ingridients[i];
          this.ingridients.push(ingridient);
        }
      }
    },
    prepareItemForEnchant() {
      let item = this.$game.inventory.getItem(this.itemId);
      this.item = item;
    }
  }
};
</script>

<style lang="less" scoped>
.fade-enter-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>