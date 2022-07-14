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
        <template v-if="chest.description">
          <div
            v-for="description in chest.descriptions"
            :key="description"
            class="font-size-20 text-align-left"
            v-html="description"
          ></div>
        </template>
      </div>
      <div class="flex flex-center flex-column">
        <div v-if="chest.claimable">
          <CustomButton
            type="green"
            width="15rem"
            @click="purchase(chest)"
            class="inline-block"
          >
            Claim
          </CustomButton>
        </div>
        <div v-if="chest.hardPrice">
          <CustomButton
            :disabled="balance.hard < chest.hardPrice"
            type="grey"
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
        <div v-if="chest.fleshPrice">
          <CustomButton
            :disabled="balance.flesh < chest.fleshPrice"
            type="grey"
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
      </div>
    </div>

    <!-- <div class="flex flex-space-between">
      <div
        class="flex flex-column flex-items-start font-size-22 font-weight-700"
      >
        <div class="chest-title text-align-center">{{ chest.title }}</div>
      </div>
      <div class="flex flex-column flex-items-center">
        <CustomButton type="blue" width="18rem" @click="$emit('open', chest)">
          Characters list
        </CustomButton>
      </div>
      <div class="text-align-center">
        <CustomButton
          type="yellow"
          width="18rem"
          @click="$emit('purchase', chest)"
        >
          Buy
        </CustomButton>
      </div>
    </div> -->
  </div>
</template>

<script>
// import CustomButton from "@/components/Button.vue";
// import Timer from "@/timer";
// import PurchaseButton from "@/components/PurchaseButton.vue";

export default {
  props: ["chest", "index"],
  components: {
    // CustomButton,
    // PurchaseButton
  },
  data: () => ({
    // timer: new Timer(true)
  }),
  computed: {
    balance() {
      return {
        hard: this.$game.hardCurrency,
        flesh: this.$game.dkt
      };
    }
  },
  mounted() {
    // this.updateAll();
  },
  // watch: {
  //   chest() {
  //     this.updateAll();
  //   }
  // },
  filters: {
    shinesPrice(value) {
      return Math.round(value);
    },
    fleshPrice(value) {
      return +(Math.round(value * 100) / 100).toFixed(2);
    }
  },
  methods: {
    // updateAll() {
    //   if (this.chest.meta.freeOpens > 0) {
    //     let resetCycle = 86400000 / this.chest.meta.freeOpens;
    //     let timeUntilNextFreeOpening =
    //       this.$game.now - this.chest.lastFreeOpening;
    //     this.timer.timeLeft = (resetCycle - timeUntilNextFreeOpening) / 1000;
    //   }
    // }
    purchase() {}
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
  background: url("/images/battle/chests/shop-squad1-chest.png") center /
    contain no-repeat;
}

.shop-squad2-chest {
  background: url("/images/battle/chests/shop-squad2-chest.png") center /
    contain no-repeat;
}

.shop-squad3-chest {
  background: url("/images/battle/chests/shop-squad3-chest.png") center /
    contain no-repeat;
}

// .silver_chest {
//   .chest-icon("chest_medium");
// }

// .velvet_chest {
//   .chest-icon("chest_large");
// }

// .halloween_chest {
//   .chest-icon("halloween_chest");
// }
.chest-title {
  width: 14rem;
}
</style>
