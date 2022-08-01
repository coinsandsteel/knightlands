<template>
  <div
    class="margin-bottom-1 padding-1 color-panel-1"
    :class="{ 'margin-top-1': index > 0 }"
  >
    <div class="flex flex-items-center flex-space-between flex-no-wrap">
      <div class="column1 flex flex-center flex-column">
        <div class="chest-icon" :class="chest.name"></div>
        <div class="font-size-22 font-weight-700">
          {{ $t("battle-" + chest.name) }}
        </div>
      </div>
      <div class="flex-full padding-left-2">
        <template v-if="chest.descriptions">
          <div
            v-for="description in chest.descriptions"
            :key="description"
            class="font-size-20 text-align-left"
            v-html="description"
          ></div>
        </template>
      </div>
      <div class="flex flex-center flex-column">
        <div
          v-if="chest.dailyMax && shop[chest.name] && !chest.claimable"
          class="font-size-18"
        >
          Items left: {{ shop[chest.name].left || 0 }}
        </div>
        <!-- claim -->
        <div v-if="chest.claimable">
          <CustomButton
            :disabled="
              chest.dailyMax && !(shop[chest.name] && shop[chest.name].left > 0)
            "
            type="green"
            width="15rem"
            @click="purchase(chest)"
            class="inline-block"
          >
            Claim
          </CustomButton>
        </div>
        <!-- hard price -->
        <div v-if="chest.hardPrice">
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
        </div>
        <!-- flesh price -->
        <div v-if="chest.fleshPrice">
          <CustomButton
            :disabled="
              (chest.dailyMax &&
                !(shop[chest.name] && shop[chest.name].left > 0)) ||
                balance.flesh < chest.fleshPrice
            "
            type="yellow"
            width="15rem"
            @click="purchase(chest, 'dkt')"
          >
            <div class="flex flex-center">
              <IconWithValue iconClass="icon-dkt">
                <div class="inline-block margin-left-half">
                  {{ chest.fleshPrice | fleshPrice }}
                </div>
              </IconWithValue>
            </div>
          </CustomButton>
        </div>
        <!-- ancient coin price -->
        <div v-if="chest.ancientCoinsPrice">
          <CustomButton
            :disabled="
              (chest.dailyMax &&
                !(shop[chest.name] && shop[chest.name].left > 0)) ||
                balance.ancientCoins < chest.ancientCoinsPrice
            "
            type="yellow"
            width="15rem"
            @click="purchase(chest, COMMODITY_COINS)"
          >
            <div class="flex flex-center">
              <BattleCoin :value="chest.ancientCoinsPrice" :hasMargin="true" />
            </div>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";
import { create } from "vue-modal-dialogs";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
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
    COMMODITY_COINS: battle.COMMODITY_COINS
  }),
  computed: {
    ...mapState("battle", ["user"]),
    shop() {
      return this.user ? this.user.shop || {} : {};
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
    async purchase(chest, currency) {
      if (
        [battle.REWARD_TYPE_DAILY, battle.COMMODITY_STARTER_PACK].includes(
          chest.commodity
        )
      ) {
        await this.performRequestNoCatch(
          this.$store.dispatch("battle/claimReward", {
            type: chest.commodity
          })
        );
      } else {
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
          this.$store.dispatch("battle/purchase", {
            commodity: chest.commodity,
            shopIndex: this.index,
            currency
          })
        );
      }

      const ShowDialog = create(
        ItemsReceived,
        "items",
        "battleUnits",
        "battleEnergyPotion"
      );
      ShowDialog(
        [],
        [
          {
            template: 17,
            fighterId: "ae073deabd00",
            isEnemy: null,
            isDead: false,
            unitId: "fb433557af8b",
            unitTribe: "goblin",
            unitClass: "melee",
            tier: 1,
            levelInt: 1,
            power: 174,
            index: null,
            hp: 71,
            abilities: [
              {
                abilityClass: "spear_strike",
                abilityType: "attack",
                tier: 1,
                value: null,
                enabled: true,
                cooldown: {
                  enabled: false,
                  estimate: 0
                }
              },
              {
                abilityClass: "wolf_bite",
                abilityType: "attack",
                tier: 2,
                value: null,
                enabled: false,
                cooldown: {
                  enabled: false,
                  estimate: 0
                }
              },
              {
                abilityClass: "fatal_strike",
                abilityType: "attack",
                tier: 3,
                value: null,
                enabled: false,
                cooldown: {
                  enabled: false,
                  estimate: 0
                }
              }
            ],
            buffs: []
          },
          {
            template: 15,
            fighterId: "4d2e6774017d",
            isEnemy: null,
            isDead: false,
            unitId: "a7a97928a15e",
            unitTribe: "goblin",
            unitClass: "range",
            tier: 1,
            levelInt: 1,
            power: 138,
            index: null,
            hp: 49,
            abilities: [
              {
                abilityClass: "power_shot",
                abilityType: "attack",
                tier: 1,
                value: null,
                enabled: true,
                cooldown: {
                  enabled: false,
                  estimate: 0
                }
              },
              {
                abilityClass: "stun_shot",
                abilityType: "de_buff",
                tier: 2,
                value: null,
                enabled: false,
                cooldown: {
                  enabled: false,
                  estimate: 0
                }
              },
              {
                abilityClass: "death_shot",
                abilityType: "attack",
                tier: 3,
                value: null,
                enabled: false,
                cooldown: {
                  enabled: false,
                  estimate: 0
                }
              }
            ],
            buffs: []
          }
        ],
        {}
      ); // @todo: update with real data
    }
  }
};
</script>

<style lang="less" scoped>
.column1 {
  width: 20rem;
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

.shop-starter-pack {
  background: url("/images/battle/chests/shop-starter-pack.png") center /
    contain no-repeat;
}

.shop-daily-reward {
  background: url("/images/battle/chests/shop-daily-reward.png") center /
    contain no-repeat;
}

.shop-energy-chest {
  background: url("/images/battle/chests/shop-energy-chest.png") center /
    contain no-repeat;
}

.shop-coin-chest {
  background: url("/images/battle/chests/shop-coin-chest.png") center / contain
    no-repeat;
}

.shop-donation-chest {
  background: url("/images/battle/chests/shop-donation-chest.png") center /
    contain no-repeat;
}

.shop-squad1-chest {
  background: url("/images/battle/chests/shop-squad1-chest.png") center / 90%
    no-repeat;
}

.shop-squad2-chest {
  background: url("/images/battle/chests/shop-squad2-chest.png") center / 90%
    no-repeat;
}

.shop-squad3-chest {
  background: url("/images/battle/chests/shop-squad3-chest.png") center / 90%
    no-repeat;
}
.chest-title {
  width: 14rem;
}
</style>
