<template>
  <Promised class="screen-content full-flex" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>
      <SoundEffect ref="successFx" :files="['craft_success']" channel="fx" />
      <div class="screen-background"></div>

      <div v-bar v-if="recipe">
        <div
          class="width-100 height-100 flex flex-column flex-no-wrap margin-top-1"
        >
          <ItemInfo
            :item="item"
            :quantity="itemsToCraft"
            class="width-100 full-flex"
          ></ItemInfo>

          <div class="flex flex-column flex-items-center full-flex">
            <Title :stackBottom="true">{{ $t("ingridients") }}</Title>

            <div class="color-panel-1 width-100 flex flex-space-evenly">
              <CraftingIngridient
                v-for="ingridient in ingridients"
                :key="`${ingridient.itemId}_${ingridientsKey}`"
                :ingridient="ingridient"
                :hintHandler="handleIngridientHint"
                :quantity="itemsToCraft"
              />
            </div>

            <div
              class="flex flex-column flex-center width-100 flex-space-evenly margin-top-2"
            >
              <NumericValue
                class="margin-bottom-2"
                :value="itemsToCraft"
                :decreaseCondition="itemsToCraft > 1"
                :increaseCondition="canCraftNext()"
                @inc="craftMore"
                @dec="craftLess"
              ></NumericValue>

              <div>
                <PurchaseButton
                  :disabled="!canCraft()"
                  type="yellow"
                  v-if="recipe.softCurrencyFee > 0"
                  @click="craftWithSoft()"
                  :price="softPrice"
                  :soft="true"
                >
                  <div class="flex flex-center">
                    <span class="margin-right-half">{{
                      $t("btn-build", { count: itemsToCraft })
                    }}</span>
                  </div>
                </PurchaseButton>

                <PurchaseButton
                  :disabled="!canCraft()"
                  type="grey"
                  v-if="recipe.hardCurrencyFee > 0"
                  @click="craftWithHard()"
                  :price="hardPrice"
                >
                  <div class="flex flex-center">
                    {{ $t("btn-build", { count: itemsToCraft }) }}
                  </div>
                </PurchaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex height-100 flex-center" v-else>
        <span class="font-size-22 font-outline font-weight-900">{{
          $t("unknown-recipe")
        }}</span>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import ItemCreatedPopup from "./ItemCreatedPopup.vue";
import CraftingIngridientHintHandler from "@/components/CraftingIngridientHintHandler.vue";
import NumericValue from "@/components/NumericValue.vue";
import Title from "@/components/Title.vue";
import SoundEffect from "@/components/SoundEffect.vue";

import { create } from "vue-modal-dialogs";

const ShowItemCreated = create(ItemCreatedPopup, "item", "amount");

export default {
  props: ["recipeId"],
  mixins: [AppSection, CraftingIngridientHintHandler],
  components: {
    SoundEffect,
    CraftingIngridient,
    PurchaseButton,
    ItemInfo,
    Promised,
    LoadingScreen,
    NumericValue,
    Title
  },
  data: () => ({
    fetchPayment: null,
    request: null,
    ready: false,
    ingridientsKey: 0,
    itemsToCraft: 1
  }),
  created() {
    this.title = "window-craft";
    this.$options.useRouterBack = true;
  },
  mounted() {
    this.ready = true;
  },
  watch: {
    recipeId: {
      handler() {
        this.itemsToCraft = 1;
      },
      immediate: true
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
    },
    softPrice() {
      return this.recipe.softCurrencyFee * this.itemsToCraft;
    },
    hardPrice() {
      return this.recipe.hardCurrencyFee * this.itemsToCraft;
    }
  },
  methods: {
    craftMore() {
      this.itemsToCraft++;
    },
    craftLess() {
      this.itemsToCraft--;
    },
    canCraftNext() {
      return this.canCraft(true);
    },
    canCraft(next) {
      if (!this.ready) {
        return false;
      }

      let hasEnough = true;
      let itemsToCraft = this.itemsToCraft;
      if (next) {
        itemsToCraft++;
      }

      for (const ingridient of this.ingridients) {
        if (
          !this.$game.inventory.hasEnoughIngridient(ingridient, itemsToCraft)
        ) {
          hasEnough = false;
          break;
        }
      }

      return hasEnough;
    },
    async handlePaymentComplete(iap, item) {
      if (item) {
        this.$refs.successFx.play();
        await ShowItemCreated(item.recipe.resultItem, item.amount);
        this.ingridientsKey++;
      }
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
      this.request = this.$game.craftRecipe(
        this.recipeId,
        currency,
        this.itemsToCraft
      );

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
