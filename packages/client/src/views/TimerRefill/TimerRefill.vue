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
          class="flex flex-center flex-no-wrap flex-column flex-end refill-method-content"
        >
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
                <!-- Native Currency -->
                <div class="flex flex-column flex-center flex-1">
                  <div class="flex flex-center margin-bottom-2 font-size-20">
                    <div>Price to restore 100% of {{ stat }}:</div>
                    <IconWithValue iconClass="icon-premium">
                      {{ hardCost }}
                    </IconWithValue>
                  </div>

                  <span class="flex flex-center font-size-20 margin-bottom-1"
                    >Refills today: {{ refillsToday }}</span
                  >
                  <span class="flex flex-center font-size-18 margin-bottom-1"
                    >Time until reset: {{ resetTimer.value }}</span
                  >
                </div>
              </div>
            </div>
          </keep-alive>

          <keep-alive>
            <div
              class="flex width-100 height-100 flex-column flex-item-center"
              v-if="methodChosen == 1"
            >
              <!--Items -->
              <RefillWithItems
                @canProceed="itemStateChanged"
                :stat="stat"
              ></RefillWithItems>
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
import RefillWithItems from "./RefillWithItems.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const NonHealthMethods = ["shinies", "items"];
const HealthMethods = ["gold", "items"];

export default {
  mixins: [NetworkRequestErrorMixin],
  props: ["stat"],
  components: {
    UserDialog,
    PromisedButton,
    ButtonBar,
    IconWithValue,
    RefillWithItems
  },
  data() {
    return {
      methodChosen: 0,
      methods: [],
      infoRequest: null,
      eventHandler: null,
      refillsToday: 0,
      resetTimer: new Timer(true),
      softCost: 0,
      items: null,
      hardCost: 0
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
    canBeConfirmed() {
      if (this.methodChosen == 0) {
        return this.hardCost <= this.$game.hardCurrency;
      }

      if (this.methodChosen == 1 && this.items) {
        for (let i in this.items) {
          if (this.items[i].count > 0) {
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
    }
  },
  methods: {
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
    }
  }
};
</script>

<style lang="less" scoped>
.refill-method-content {
  height: 50vh;
}
</style>
