<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <div class="flex flex-column padding-1 flex-center">
        <LoadingScreen :loading="true" :opacity="0.7" v-show="isPending && isDelayOver"></LoadingScreen>

        <StripedPanel class="craft width-100" contentClasses="height-100" v-if="recipeId">
          <ItemInfo :item="item" class="width-100"></ItemInfo>

          <div class="flex flex-column flex-items-center flex-end full-flex">
            <span class="title font-size-20 margin-top-3">{{$t("ingridients")}}</span>

            <StripedContent
              classes="margin-top-3 margin-bottom-5 width-100"
              contentClasses="width-100 flex flex-space-evenly"
            >
              <crafting-ingridient
                v-for="ingridient in ingridients"
                :key="`${ingridient.itemId}_${ingridientsKey}`"
                :ingridient="ingridient"
                :hintHandler="handleIngridientHint"
              />
            </StripedContent>

            <div class="flex flex-center width-100 flex-space-evenly">
              <CustomButton
                :disabled="!canCraft() && $game.softCurrency >= recipe.softCurrencyFee"
                type="yellow"
                v-if="recipe.softCurrencyFee > 0"
                @click="craftWithSoft()"
              >
                <div class="flex flex-center">
                  <span class="margin-right-half">{{$t("btn-build")}}</span>
                  <IconWithValue iconClass="icon-gold">{{recipe.softCurrencyFee}}</IconWithValue>
                </div>
              </CustomButton>

              <CustomButton
                :disabled="!canCraft() && $game.hardCurrency >= recipe.hardCurrencyFee"
                type="grey"
                v-if="recipe.hardCurrencyFee > 0"
                @click="craftWithHard()"
              >
                <div class="flex flex-center">
                  {{$t("btn-build")}}
                  <IconWithValue iconClass="icon-premium">{{recipe.hardCurrencyFee}}</IconWithValue>
                </div>
              </CustomButton>

              <PaymentStatus v-if="recipe.iap" :request="fetchPayment" @pay="continuePurchase">
                <CustomButton :disabled="!canCraft" type="green" @click="craftWithFiat()">
                  <price-tag :dark="true" :iap="recipe.iap"></price-tag>
                </CustomButton>
              </PaymentStatus>
            </div>
          </div>
        </StripedPanel>
      </div>
    </template>
  </Promised>
</template>

<script>
import StripedContent from "@/components/StripedContent.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import AppSection from "@/AppSection";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import PriceTag from "@/components/PriceTag.vue";
import CurrencyType from "@/../knightlands-shared/currency_type";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import Events from "@/../knightlands-shared/events";
import ItemCreatedPopup from "./ItemCreatedPopup.vue";
import CraftingIngridientHintHandler from "@/components/CraftingIngridientHintHandler.vue";

import { create } from "vue-modal-dialogs";

const ShowItemCreated = create(ItemCreatedPopup, ...ItemCreatedPopup.props);

export default {
  props: ["recipeId"],
  mixins: [AppSection, PaymentHandler, CraftingIngridientHintHandler],
  components: {
    StripedContent,
    StripedPanel,
    CraftingIngridient,
    CustomButton,
    IconWithValue,
    ItemInfo,
    PriceTag,
    Promised,
    LoadingScreen,
    PaymentStatus
  },
  data: () => ({
    fetchPayment: null,
    request: null,
    ready: false,
    ingridientsKey: 0
  }),
  created() {
    this.title = "window-craft";
    this.$options.useRouterBack = true;
    this.$options.paymentEvents.push(Events.CraftingStatus);
    this.fetchPaymentStatus();
  },
  mounted() {
    this.ready = true;
  },
  watch: {
    recipeId() {
      this.fetchPaymentStatus();
    }
  },
  computed: {
    item() {
      return this.$game.crafting.getResultItem(this.recipeId);
    },
    recipe() {
      return this.$game.crafting.getRecipe(this.recipeId);
    },
    ingridients() {
      return this.$game.crafting.getRecipeIngridients(this.recipeId);
    }
  },
  methods: {
    canCraft() {
      if (!this.ready) {
        return false;
      }

      let hasEnough = true;

      for (const ingridient of this.ingridients) {
        if (!this.$game.inventory.hasEnoughIngridient(ingridient)) {
          hasEnough = false;
          break;
        }
      }

      return hasEnough;
    },
    async handlePaymentComplete(iap, item) {
      if (item) {
        await ShowItemCreated(item.resultItem);
        this.ingridientsKey++;
      }
    },
    async fetchPaymentStatus() {
      this.fetchPayment = this.$game.fetchCraftingStatus(this.recipeId);
    },
    craftWithSoft() {
      this.craft(CurrencyType.Soft);
    },
    craftWithHard() {
      this.craft(CurrencyType.Hard);
    },
    craftWithFiat() {
      this.craft(CurrencyType.Fiat);
    },
    async craft(currency) {
      this.request = this.$game.craftRecipe(this.recipeId, currency);

      if (currency == CurrencyType.Fiat) {
        this.request = this.purchaseRequest(this.request);
      } else {
        let item = await this.request;

        if (item) {
          this.handlePaymentComplete("", item);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.craft {
  margin: 2rem;
}
</style>