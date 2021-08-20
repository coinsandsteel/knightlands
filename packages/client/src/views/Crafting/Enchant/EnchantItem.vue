<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <SoundEffect ref="successFx" :files="['enchant_success']" channel="fx" />
    <SoundEffect ref="failFx" :files="['enchant_fail']" channel="fx" />

    <div class="height-100" v-bar>
      <div>
        <div
          class="dummy-height flex flex-center flex-column padding-top-1"
          v-if="item"
        >
          <ItemInfo
            :item="item"
            :onlyStats="true"
            :lootProps="{ onlyIcon: true }"
            class="width-100"
          >
            <template v-slot:beforeStats>
              <div ref="level">
                <div
                  class="flex flex-center flex-column margin-top-1 font-size-20 color-panel-1"
                >
                  <div class="flex flex-center padding-1">
                    <span class="yellow-title margin-right-half">{{
                      $t("enchanting-level")
                    }}</span>
                    <span class="yellow-title">{{ item.enchant || 0 }}</span>
                    <template v-if="canEnchant">
                      <span
                        class="margin-left-half margin-right-half right-arrow"
                      ></span>
                      <span class="green-title">{{
                        (item.enchant || 0) + 1
                      }}</span>
                    </template>
                  </div>
                  <span
                    class="font-size-18 rarity-legendary"
                    v-if="lvlWillReduce"
                  >
                    {{ $t("enchant-f", { lvl: failLvl }) }}
                  </span>
                  <span class="font-size-18 rarity-legendary" v-else>{{
                    $t("enchant-s")
                  }}</span>
                </div>
              </div>
            </template>

            <template v-slot:stats v-if="canEnchant">
              <div
                class="color-panel-2 stacked-bottom flex flex-center font-size-20 flex-space-evenly"
              >
                <div
                  class="flex width-40 flex-column flex-item-end text-align-right"
                >
                  <div
                    v-for="(statValue, statId) in stats"
                    :key="statId"
                    class="margin-bottom-half width-100"
                  >
                    {{ $t(statId) }}
                  </div>
                </div>
                <div class="flex width-40 flex-column text-align-left">
                  <div
                    v-for="(statValue, statId) in stats"
                    :key="statId"
                    class="margin-bottom-half flex flex-center flex-start width-100"
                  >
                    {{ statValue }}
                    <span
                      class="margin-left-half margin-right-half right-arrow"
                    ></span>
                    {{ futureStats[statId] }}
                  </div>
                </div>
              </div>
            </template>
          </ItemInfo>

          <span
            class="flex flex-center font-size-22 color-panel-2"
            v-if="!canEnchant"
          >
            <span class="rarity-mythical margin-right-half">{{
              $t("enchanting-maxed-out")
            }}</span>
          </span>

          <template v-if="canEnchant">
            <Title class="margin-bottom-1" :stackTop="true">{{
              $t("enchant-materials")
            }}</Title>

            <div
              classes="margin-top-2 margin-bottom-2"
              contentClasses="width-100 flex flex-space-evenly"
              stripeHeight="10rem"
            >
              <crafting-ingridient
                v-for="ingridient in ingridients"
                :key="ingridient.itemId"
                :ingridient="ingridient"
                :hintHandler="showHint"
              />
            </div>

            <template v-if="!paymentInProcess">
              <transition name="fade" mode="out-in">
                <span
                  class="margin-top-1 margin-bottom-1 rarity-mythical font-outline font-size-20"
                  v-if="failed"
                  key="failed"
                  >{{ $t("enchant-failed") }}</span
                >
                <span
                  class="margin-top-1 margin-bottom-1 orange-title font-outline font-size-20"
                  v-if="!failed"
                  key="success"
                  >{{
                    $t("enchant-success-rate", {
                      rate: stepData.successRate
                    })
                  }}</span
                >
              </transition>
            </template>

            <div class="flex flex-center width-100" v-if="!paymentInProcess">
              <PurchaseButton
                type="yellow"
                :soft="true"
                :price="stepData.soft"
                @click="enchant(currencies.Soft)"
              >
                {{ $t("btn-enchant") }}
              </PurchaseButton>
            </div>

            <div
              class="margin-top-3 flex flex-column margin-bottom-5 color-panel-3"
              v-if="stepData.successRate < 100"
            >
              <span
                class="margin-top-1 margin-bottom-1 success-font font-outline font-size-20"
                >{{ $t("enchant-success-rate", { rate: 100 }) }}</span
              >

              <div class="flex flex-center width-100 flex-space-evenly">
                <PurchaseButton
                  type="grey"
                  @click="enchant(currencies.Hard)"
                  :price="stepData.hard"
                >
                  {{ $t("btn-enchant") }}
                </PurchaseButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";
import anime from "animejs/lib/anime.es.js";
import ItemInfo from "@/components/ItemInfo.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import HintHandler from "@/components/HintHandler.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import Title from "@/components/Title.vue";
import InventoryListenerMixin from "@/components/InventoryListenerMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const EnchantingMeta = require("@/enchanting_meta.json");
const RollBackLevel = 9;

export default {
  mixins: [
    AppSection,
    PromptMixin,
    HintHandler,
    InventoryListenerMixin,
    NetworkRequestErrorMixin
  ],
  props: ["itemId"],
  components: {
    SoundEffect,
    ItemInfo,
    PurchaseButton,
    CraftingIngridient,
    Title
  },
  created() {
    this.title = "window-enchant-item";
    this.$options.useRouterBack = true;
  },
  activated() {
    this.prepareItemForEnchant();
    this.updateEnchantItemsList();
  },
  data: () => ({
    item: null,
    ingridients: [],
    currencies: CurrencyType,
    fetchPayment: null,
    failed: false,
    paymentInProcess: false,
    newItemId: 0
  }),
  watch: {
    itemId() {
      this.prepareItemForEnchant();
      this.updateEnchantItemsList();
    }
  },
  computed: {
    lvlWillReduce() {
      return this.item.enchant > RollBackLevel;
    },
    failLvl() {
      return this.item.enchant - 1;
    },
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

        const isWeapon = this.$game.itemsDB.isWeapon(this.item.template);
        const isAccessory = this.$game.itemsDB.isAccessory(this.item.template);
        const isArmour = this.$game.itemsDB.isArmour(this.item.template);

        let steps = {};

        if (isWeapon) {
          steps = EnchantingMeta.weapon;
        } else if (isAccessory) {
          steps = EnchantingMeta.accessory;
        } else if (isArmour) {
          steps = EnchantingMeta.armour;
        }

        return steps[template.rarity].steps[this.currentEnchantingLevel];
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
    async enchant(currency) {
      let newItemId = await this.performRequest(
        this.$game.enchantItem(this.itemId, currency)
      );
      if (newItemId === false) {
        this.notifyEnchantingFailed();
      } else {
        this.$refs.successFx.play();
        if (newItemId && newItemId != this.itemId) {
          this.newItemId = newItemId;
        }
      }

      this.updateEnchantItemsList();
    },
    handleInventoryChanged() {
      if (this.newItemId != 0) {
        this.$router.replace({
          name: "enchant-item",
          params: { itemId: this.newItemId }
        });
        this.newItemId = 0;
      }
    },
    notifyEnchantingFailed() {
      this.$refs.failFx.play();
      this.failed = true;
      clearTimeout(this.failedTimeout);
      this.failedTimeout = setTimeout(() => (this.failed = false), 2000);

      anime({
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
        easing: "easeOutExpo",
        duration: 325,
        loop: 1
      });
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
      this.item = this.$game.inventory.getItem(this.itemId);
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
