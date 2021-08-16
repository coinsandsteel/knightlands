<template>
  <user-dialog :title="$t(title)" @close="$close(false)" :disableScroll="true">
    <template v-slot:content>
      <div class="flex flex-column">
        <div class="font-size-20">{{ $t("refill-message") }}</div>

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
                  <span>Price to restore 100% of {{ stat }}:</span>
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
                <div class="flex flex-center margin-bottom-2 font-size-20">
                  <span>Price to restore 100 {{ $t(stat) }}:</span>
                  <IconWithValue iconClass="icon-premium">
                    {{ hardCost }}
                  </IconWithValue>
                </div>

                <NumericValue
                  class="margin-2"
                  :value="restores"
                  :decreaseCondition="restores >= 1"
                  :increaseCondition="canRestoreMore"
                  @inc="restores++"
                  @dec="restores--"
                ></NumericValue>

                <span class="flex flex-center font-size-20 margin-bottom-1"
                  >Refills today: {{ refillsToday }}</span
                >
                <span class="flex flex-center font-size-18 margin-bottom-1"
                  >Time until reset: {{ resetTimer.value }}</span
                >
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

          <div class="flex">
            <PromisedButton
              :disabled="!canProcceed"
              width="16rem"
              type="yellow"
              @click="confirm"
              >{{ $t("btn-confirm") }}</PromisedButton
            >
          </div>
        </div>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import CharacterStats from "@/../../knightlands-shared/character_stat";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import Timer from "@/timer";
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
    PromisedButton,
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
      softCost: 0,
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
  },
  computed: {
    hardCost() {
      return 100;
    },
    canRestoreMore() {
      return true;
    },
    maxStat() {
      return this.$game.character.maxStats[this.stat];
    },
    timer() {
      return this.$game.character.getTimer(this.stat);
    },
    barValue() {
      return Math.min(this.restoredValue + this.timer.value, this.maxStat);
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
    }
  },
  methods: {
    increstoreCount() {
      this.restores++;
    },
    itemStateChanged(canProceed, items) {
      this.items = items;
    },
    async confirm() {
      await this.performRequest(
        this.$game.refillTimer(this.stat, this.methodChosen, this.items)
      );
      this.items = null;
      this.$close();
    },
    async fetchInfo() {
      this.infoRequest = this.$game.getTimerRefillInfo(this.stat);

      let info = await this.infoRequest;
      this.iap = info.iap;
      this.refillsToday = info.refills;
      this.softCost = info.soft;
      this.hardCost = info.hard;
      this.resetTimer.timeLeft = info.timeTillReset / 1000;
    },
    handleItemSelected(count, item) {
      const action = this.$game.itemsDB.getTemplate(item).action;

      if (!this.selectedItems[item.id]) {
        this.$set(this.selectedItems, item.id, {
          template: item.template,
          value: action.value,
          relative: action.relative,
          count: count,
          stat: action.stat
        });
      } else {
        this.selectedItems[item.id].count = count;
      }

      let restoredValue = 0;
      for (let itemId in this.selectedItems) {
        // first relative bonuses
        const consumable = this.selectedItems[itemId];
        if (consumable.relative) {
          restoredValue +=
            (this.$game.character.getMaxStat(consumable.stat) *
              consumable.value *
              consumable.count) /
            100;
        }
      }

      for (let itemId in this.selectedItems) {
        // first relative bonuses
        const consumable = this.selectedItems[itemId];
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
