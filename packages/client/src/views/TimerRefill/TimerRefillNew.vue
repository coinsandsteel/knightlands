<template>
  <user-dialog :title="$t(title)" @close="$close(false)" :disableScroll="true">
    <template v-slot:content>
      <div class="flex flex-column">
        <button-bar
          class="margin-top-2 margin-bottom-2"
          :sections="methods"
          v-model="methodChosen"
        ></button-bar>

        <div
          class="flex flex-center flex-no-wrap flex-column refill-method-content"
        >
          <progress-bar
            :maxValue="maxStat"
            :hideMaxValue="true"
            v-model="barValue"
            :barType="color"
          ></progress-bar>

          <keep-alive>
            <div
              class="flex flex-basis-100 flex-column flex-item-center"
              v-if="showGoldOption"
            >
              <div class="flex flex-column flex-center flex-1">
                <div class="flex flex-center margin-bottom-2 font-size-20">
                  <span>{{ $t("r-stat", { stat: $t(stat) }) }}</span>
                  <IconWithValue iconClass="icon-gold">
                    {{ softCost }}
                  </IconWithValue>
                </div>
              </div>
            </div>
          </keep-alive>

          <keep-alive>
            <div
              class="flex flex-basis-100 flex-column flex-item-center"
              v-if="methodChosen == 0 && !isHealth"
            >
              <!-- Shinies -->
              <div
                class="flex flex-basis-100 height-100 flex-column flex-item-center"
              >
                <NumericValue
                  class="margin-2"
                  :value="restores"
                  :decreaseCondition="restores >= 1"
                  :increaseCondition="canRestoreMore"
                  @inc="restores++"
                  @dec="restores--"
                  @max="setMax"
                  @reset="reset"
                >
                  <template v-slot:between>
                    <IconWithValue :iconClass="statIcon">{{
                      restoreAmount
                    }}</IconWithValue>
                  </template>
                </NumericValue>

                <div class="flex flex-center margin-bottom-2 font-size-20">
                  <span class="margin-right-1">
                    {{ $t("total-cost") }}
                  </span>
                  <IconWithValue iconClass="icon-premium">
                    {{ hardCost }}
                  </IconWithValue>
                </div>

                <span class="flex flex-center font-size-20 margin-bottom-1">{{
                  $t("refills-today", { c: refillsToday })
                }}</span>
                <span class="flex flex-center font-size-18 margin-bottom-1">{{
                  $t("till-reset", { t: resetTimer.value })
                }}</span>
              </div>
            </div>
          </keep-alive>

          <keep-alive>
            <div
              class="flex width-100 height-100 flex-column flex-item-center"
              v-if="methodChosen == 1"
            >
              <div
                class="width-100"
                v-bar="{
                  preventParentScroll: true,
                  scrollThrottle: 30
                }"
              >
                <div>
                  <div class="flex flex-space-evenly width-100">
                    <ItemSelector
                      class="flex-basis-50"
                      v-for="item in items"
                      :key="item.id"
                      :item="item"
                      :predictedHp="barValue"
                      :maxStat="maxStat"
                      @changed="handleItemSelected"
                      @hint="handleHint"
                    />
                  </div>
                </div>
              </div>
            </div>
          </keep-alive>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex">
        <PurchaseButton
          :disabled="!canProcceed"
          type="yellow"
          :soft="softCost > 0"
          :price="hardCost || softCost"
          @click="confirm"
          id="confirm-refill"
          >{{ $t("btn-confirm") }}</PurchaseButton
        >
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import CharacterStats from "@/../../knightlands-shared/character_stat";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import Timer from "@/timer";
import RefillMeta from "@/metadata/refill";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import NumericValue from "@/components/NumericValue.vue";

const ItemType = require("@/../../knightlands-shared/item_type");
const ItemActions = require("@/../../knightlands-shared/item_actions");
import ItemSelector from "./ItemSelector.vue";
import HintHandler from "@/components/HintHandler.vue";

const NonHealthMethods = ["shinies", "items"];
const HealthMethods = ["gold", "items"];

export default {
  mixins: [HintHandler, NetworkRequestErrorMixin],
  props: ["stat"],
  components: {
    NumericValue,
    ProgressBar,
    UserDialog,
    PurchaseButton,
    ButtonBar,
    IconWithValue,
    ItemSelector
  },
  data() {
    return {
      restoredValue: 0,
      methodChosen: 0,
      methods: [],
      infoRequest: null,
      eventHandler: null,
      refillsToday: 0,
      resetTimer: new Timer(true),
      soft: 0,
      selectedItems: {},
      restores: 0
    };
  },
  created() {
    this.methods =
      this.stat == CharacterStats.Health ? HealthMethods : NonHealthMethods;
  },
  mounted() {
    this.fetchInfo();

    if (this.items.length != 0) {
      this.methodChosen = 1;
    }
  },
  watch: {
    methodChosen() {
      this.selectedItems = {};
      this.restores = 0;
      this.restoredValue = 0;
    }
  },
  computed: {
    hardCost() {
      let cost = 0;
      for (let i = 0; i < this.restores; ++i) {
        cost += this.calculateCost(i + this.refillsToday + 1);
      }
      return cost;
    },
    statIcon() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "icon-health";
        case CharacterStats.Energy:
          return "icon-energy";
        case CharacterStats.Stamina:
          return "icon-stamina";
      }
      return "";
    },
    restoreAmount() {
      if (!RefillMeta[this.stat]) {
        return 0;
      }
      return (
        this.restores * RefillMeta[this.stat][this.$game.character.level - 1]
      );
    },
    canRestoreMore() {
      return this.barValue < this.maxStat;
    },
    maxStat() {
      return this.$game.character.maxStats[this.stat];
    },
    timer() {
      return this.$game.character.getTimer(this.stat);
    },
    barValue() {
      return this.restoredValue + this.restoreAmount + this.timer.value;
    },
    color() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "red";
        case CharacterStats.Energy:
          return "blue";
        case CharacterStats.Stamina:
          return "yellow";
      }
      return "";
    },
    canBeConfirmed() {
      if (this.methodChosen == 0) {
        return this.hardCost <= this.$game.hardCurrency;
      }
      if (this.methodChosen == 1 && this.selectedItems) {
        for (let i in this.selectedItems) {
          if (this.selectedItems[i].count > 0) {
            return true;
          }
        }
      }

      return false;
    },
    canProcceed() {
      if (this.showGoldOption) {
        return this.$game.softCurrency >= this.softCost;
      }

      return this.canBeConfirmed;
    },
    isHealth() {
      return this.stat == CharacterStat.Health;
    },
    showGoldOption() {
      return this.methodChosen == 0 && this.isHealth;
    },
    title() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "health-refill-title";

        case CharacterStats.Stamina:
          return "stamina-refill-title";

        case CharacterStats.Energy:
          return "energy-refill-title";
      }

      return "";
    },
    items() {
      let itemsDB = this.$game.itemsDB;
      return this.$game.inventory.filterItems(x => {
        if (x.unique) {
          return false;
        }

        const template = itemsDB.getTemplate(x.template);
        if (template.type != ItemType.Consumable || !template.action) {
          return false;
        }

        if (template.action.action == ItemActions.RefillTimer) {
          if (template.action.stat == this.stat) {
            return true;
          }
        }

        return false;
      });
    },
    softCost() {
      return this.methodChosen == 0 ? this.soft : 0;
    }
  },
  methods: {
    setMax() {
      while (this.canRestoreMore) {
        this.increstoreCount();
      }
    },
    reset() {
      this.restores = 0;
    },
    calculateCost(count) {
      return Math.round(
        RefillMeta.cost.base * Math.pow(count, RefillMeta.cost.expScale)
      );
    },
    increstoreCount() {
      this.restores++;
    },
    async confirm() {
      await this.performRequest(
        this.$game.refillTimer(
          this.stat,
          this.methodChosen,
          this.selectedItems,
          this.restores
        )
      );
      this.$close();
    },
    async fetchInfo() {
      this.infoRequest = this.$game.getTimerRefillInfo(this.stat);

      let info = await this.infoRequest;
      this.iap = info.iap;
      this.refillsToday = info.refills;
      this.soft = info.soft;
      this.resetTimer.timeLeft = info.timeTillReset / 1000;
    },
    handleItemSelected(count, item) {
      const action = this.$game.itemsDB.getTemplate(item).action;

      if (!this.selectedItems[item.template]) {
        this.$set(this.selectedItems, item.template, {
          id: item.id,
          template: item.template,
          value: action.value,
          relative: action.relative,
          count: count,
          stat: action.stat
        });
      } else {
        this.selectedItems[item.template].count = count;
      }

      let restoredValue = 0;
      for (let template in this.selectedItems) {
        // first relative bonuses
        const consumable = this.selectedItems[template];
        if (consumable.relative) {
          restoredValue +=
            (this.$game.character.getMaxStat(consumable.stat) *
              consumable.value *
              consumable.count) /
            100;
        }
      }

      for (let template in this.selectedItems) {
        // first relative bonuses
        const consumable = this.selectedItems[template];
        if (!consumable.relative) {
          restoredValue += consumable.value * consumable.count;
        }
      }

      this.restoredValue = restoredValue;
    }
  }
};
</script>

<style lang="less" scoped>
.refill-method-content {
  height: 50vh;
}
</style>
