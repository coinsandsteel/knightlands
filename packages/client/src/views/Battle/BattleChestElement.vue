<template>
  <div
    class="margin-bottom-1 padding-1 color-panel-1"
    :class="{ 'margin-top-1': index > 0 }"
  >
    <div class="flex flex-items-center flex-space-between flex-no-wrap">
      <div class="column1 flex flex-center flex-column">
        <div class="chest-icon" :class="chest.name"></div>
        <div class="font-size-22 font-weight-700">
          {{ $t("battle-shop-" + chest.name) }}
        </div>
      </div>
      <div class="flex-full padding-left-1 padding-right-1">
        <template v-if="chest.content.description">
          <div
            v-for="description in chest.content.description"
            :key="description"
            class="font-size-20 text-align-left"
            v-html="description"
          ></div>
        </template>
      </div>
      <div class="flex flex-center flex-column">
        <div v-if="chest.dailyMax && !chest.claimable" class="font-size-18">
          Items left: {{ purchaseLeftCount }}
        </div>
        <!-- claim -->
        <div v-if="chest.claimable">
          <CustomButton
            :disabled="!canPurchase"
            type="green"
            width="15rem"
            @click="purchase(chest)"
            class="inline-block"
          >
            Claim
          </CustomButton>
        </div>
        <!-- hard price -->
        <!-- <div v-if="chest.price && chest.price.currency === 'hard'">
          <CustomButton
            :disabled="
              (chest.dailyMax &&
                !(shop[chest.name] && shop[chest.name].left > 0)) ||
                balance.hard < chest.hardPrice
            "
            type="yellow"
            width="15rem"
            @click="purchase(chest, 'hard')"
            :class="'margin-bottom-1'"
          >
            <div class="flex flex-center">
              <IconWithValue iconClass="icon-premium">
                <div class="inline-block margin-left-half">
                  {{ chest.hardPrice | shinesPrice }}
                </div>
              </IconWithValue>
            </div>
          </CustomButton>
        </div> -->
        <!-- flesh price -->
        <div v-if="chest.price && chest.price.currency === 'flesh'">
          <CustomButton
            :disabled="!canPurchase || balance.flesh < chest.price.amount"
            type="yellow"
            width="15rem"
            @click="purchase(chest)"
          >
            <div class="flex flex-center">
              <IconWithValue iconClass="icon-dkt">
                <div class="inline-block margin-left-half">
                  {{ chest.price.amount | fleshPrice }}
                </div>
              </IconWithValue>
            </div>
          </CustomButton>
        </div>
        <!-- ancient coin price -->
        <div v-if="chest.price && chest.price.currency === 'coins'">
          <CustomButton
            :disabled="
              !canPurchase || balance.ancientCoins < chest.price.amount
            "
            type="yellow"
            width="15rem"
            @click="purchase(chest)"
          >
            <div class="flex flex-center">
              <BattleCoin :value="chest.price.amount" :hasMargin="true" />
            </div>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentDateString } from "@/helpers/utils";
import * as battle from "@/../../knightlands-shared/battle";
import { create } from "vue-modal-dialogs";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleTribeSelect from "@/views/Battle/BattleTribeSelect.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  props: ["chest", "index"],
  components: {
    BattleCoin
  },
  data: () => ({
    CURRENCY_COINS: battle.CURRENCY_COINS
  }),
  computed: {
    ...mapState("battle", ["user"]),
    items() {
      return this.user ? this.user.items || [] : [];
    },
    counters() {
      return this.user ? this.user.counters : null;
    },
    purchasedCount() {
      const dateString = getCurrentDateString();
      return this.counters &&
        this.counters.purchase &&
        this.counters.purchase[dateString] &&
        this.counters.purchase[dateString][this.chest.id]
        ? this.counters.purchase[dateString][this.chest.id] || 0
        : 0;
    },
    purchaseLeftCount() {
      return this.chest.dailyMax
        ? this.chest.dailyMax - this.purchasedCount
        : Infinity;
    },
    canPurchase() {
      if (this.chest.claimable) {
        return this.items.find(
          ({ id, quantity }) => id === this.chest.id && quantity > 0
        );
      }

      if (this.chest.dailyMax) {
        return this.purchaseLeftCount > 0;
      }

      return true;
    },
    balance() {
      return {
        hard: this.$game.hardCurrency,
        flesh: this.$game.dkt,
        ancientCoins: this.$store.state.battle.user.balance.coins || 0
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
    async purchase(chest) {
      // const items = await this.performRequestNoCatch(
      //   this.$store.dispatch("battle/purchase", {
      //     id: chest.id
      //   })
      // );
      // console.log(items);
      // return;

      let shouldPurchase = true;
      let tribe = null;

      if (chest && chest.content && chest.content.units && !chest.claimable) {
        const show = create(BattleTribeSelect);
        tribe = await show();

        if (!tribe) {
          return;
        }
      }

      if (!chest.claimable) {
        shouldPurchase = !!(await this.showPrompt(
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
        ));
      }

      if (!shouldPurchase) {
        return;
      }

      const result = await this.performRequestNoCatch(
        this.$store.dispatch("battle/purchase", {
          id: chest.id,
          tribe
        })
      );

      let units = [];
      let energy = null;
      if (result && result.length > 0 && result[0].unitId) {
        units = result;
      }

      if (chest.commodity === battle.COMMODITY_ENERGY_POTION) {
        energy = chest.content.energy;
      }

      const ShowDialog = create(
        ItemsReceived,
        "items",
        "battleUnits",
        "battleEnergyPotion"
      );
      ShowDialog(
        [],
        units,
        energy
        // [
        //   {
        //     template: 17,
        //     fighterId: "ae073deabd00",
        //     isEnemy: null,
        //     isDead: false,
        //     unitId: "fb433557af8b",
        //     tribe: "goblin",
        //     class: "melee",
        //     tier: 1,
        //     levelInt: 1,
        //     power: 174,
        //     index: null,
        //     hp: 71,
        //     abilities: [
        //       {
        //         abilityClass: "spear_strike",
        //         abilityType: "attack",
        //         tier: 1,
        //         value: null,
        //         enabled: true,
        //         cooldown: {
        //           enabled: false,
        //           estimate: 0
        //         }
        //       },
        //       {
        //         abilityClass: "wolf_bite",
        //         abilityType: "attack",
        //         tier: 2,
        //         value: null,
        //         enabled: false,
        //         cooldown: {
        //           enabled: false,
        //           estimate: 0
        //         }
        //       },
        //       {
        //         abilityClass: "fatal_strike",
        //         abilityType: "attack",
        //         tier: 3,
        //         value: null,
        //         enabled: false,
        //         cooldown: {
        //           enabled: false,
        //           estimate: 0
        //         }
        //       }
        //     ],
        //     buffs: []
        //   },
        //   {
        //     template: 15,
        //     fighterId: "4d2e6774017d",
        //     isEnemy: null,
        //     isDead: false,
        //     unitId: "a7a97928a15e",
        //     tribe: "goblin",
        //     class: "range",
        //     tier: 1,
        //     levelInt: 1,
        //     power: 138,
        //     index: null,
        //     hp: 49,
        //     abilities: [
        //       {
        //         abilityClass: "power_shot",
        //         abilityType: "attack",
        //         tier: 1,
        //         value: null,
        //         enabled: true,
        //         cooldown: {
        //           enabled: false,
        //           estimate: 0
        //         }
        //       },
        //       {
        //         abilityClass: "stun_shot",
        //         abilityType: "de_buff",
        //         tier: 2,
        //         value: null,
        //         enabled: false,
        //         cooldown: {
        //           enabled: false,
        //           estimate: 0
        //         }
        //       },
        //       {
        //         abilityClass: "death_shot",
        //         abilityType: "attack",
        //         tier: 3,
        //         value: null,
        //         enabled: false,
        //         cooldown: {
        //           enabled: false,
        //           estimate: 0
        //         }
        //       }
        //     ],
        //     buffs: []
        //   }
        // ],
      );
    }
  }
};
</script>

<style lang="less" scoped>
.column1 {
  width: 18rem;
}
.chest-icon {
  // background: no-repeat url("../../assets/ui/@{chest}.png");
  // background-size: contain;
  // background-position: center;
  width: 8rem;
  height: 8rem;
  display: inline-block;
  // cursor: pointer;
}

.starter-pack {
  background: url("/images/battle/chests/shop-starter-pack.png") center /
    contain no-repeat;
}

.daily-chest {
  background: url("/images/battle/chests/shop-daily-reward.png") center /
    contain no-repeat;
}

.energy-potion {
  background: url("/images/battle/chests/shop-energy-chest.png") center /
    contain no-repeat;
}

.coin-chest {
  background: url("/images/battle/chests/shop-coin-chest.png") center / contain
    no-repeat;
}

.donation-chest {
  background: url("/images/battle/chests/shop-donation-chest.png") center /
    contain no-repeat;
}

.squad1-chest {
  background: url("/images/battle/chests/shop-squad1-chest.png") center / 90%
    no-repeat;
}

.squad2-chest {
  background: url("/images/battle/chests/shop-squad2-chest.png") center / 90%
    no-repeat;
}

.squad3-chest {
  background: url("/images/battle/chests/shop-squad3-chest.png") center / 90%
    no-repeat;
}
.chest-title {
  width: 14rem;
}
</style>
