<template>
  <div
    class="margin-bottom-1 padding-1 color-panel-1"
    :class="{ 'margin-top-1': index > 0 }"
  >
    <div class="flex flex-items-center flex-space-between flex-no-wrap">
      <div :class="chest.name"></div>
      <div class="flex-full padding-left-2">
        <div
          v-for="description in chest.descriptions"
          :key="description"
          class="font-size-20 text-align-left"
          v-html="description"
        ></div>
      </div>
    </div>

    <div class="flex flex-space-between">
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

      <!-- <div
        class="flex flex-center flex-items-end flex-column"
        v-else-if="chest.meta.iaps.length > 0"
      >
        <span
          class="font-size-18 margin-bottom-half"
          v-show="timer.timeLeft > 0"
          >{{ $t("free-chest-timer", { timer: timer.value }) }}</span
        >

        <PurchaseButton
          v-for="(iap, index) in chest.meta.iaps"
          :key="index"
          :price="iap.price"
          type="yellow"
          @click="$emit('purchase', chest.name, index)"
          class="margin-bottom-1"
        >
          <div class="flex flex-items-center">
            <span>{{ $t("btn-open") }}</span>
            <span
              v-if="iap.count > 1"
              class="margin-left-half margin-right-half"
              >x{{ iap.count }}</span
            >
          </div>
        </PurchaseButton>
      </div>
      <span
        class="font-size-18 margin-bottom-half"
        v-else
        v-show="timer.timeLeft > 0"
        >{{ $t("free-chest-timer", { timer: timer.value }) }}</span
      > -->
      <div class="text-align-center">
        <CustomButton
          type="yellow"
          width="18rem"
          @click="$emit('purchase', chest)"
        >
          Buy
        </CustomButton>
      </div>
    </div>
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
  mounted() {
    // this.updateAll();
  },
  // watch: {
  //   chest() {
  //     this.updateAll();
  //   }
  // },
  methods: {
    // updateAll() {
    //   if (this.chest.meta.freeOpens > 0) {
    //     let resetCycle = 86400000 / this.chest.meta.freeOpens;
    //     let timeUntilNextFreeOpening =
    //       this.$game.now - this.chest.lastFreeOpening;
    //     this.timer.timeLeft = (resetCycle - timeUntilNextFreeOpening) / 1000;
    //   }
    // }
  },
  computed: {
    // keyIcon() {
    //   return this.$game.itemsDB.getIcon(this.chest.meta.keyItem);
    // },
    // totalKeys() {
    //   return this.$game.inventory.getItemsCountByTemplate(
    //     this.chest.meta.keyItem
    //   );
    // },
    // batchSize() {
    //   return this.totalKeys > 10 ? 10 : this.totalKeys;
    // },
    // hasKey() {
    //   return this.totalKeys > 0;
    // },
    // freeOpenAvailable() {
    //   return this.chest.meta.freeOpens > 0 && this.timer.timeLeft <= 0;
    // }
  }
};
</script>

<style lang="less" scoped>
.chest-icon(@chest) {
  background: no-repeat url("../../assets/ui/@{chest}.png");
  background-size: contain;
  background-position: center;
  width: 14rem;
  height: 14rem;
  display: inline-block;
  cursor: pointer;

  &.disabled {
    opacity: 0.3;
  }
}

.wooden_chest {
  .chest-icon("chest_small");
}

.silver_chest {
  .chest-icon("chest_medium");
}

.velvet_chest {
  .chest-icon("chest_large");
}

// .halloween_chest {
//   .chest-icon("halloween_chest");
// }
.chest-title {
  width: 14rem;
}
</style>
